# Common Errors & Solutions

## Build & Configuration Errors

### TailwindCSS v4 PostCSS Configuration Error

**Error Message:**
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS 
with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

**Root Cause:**
TailwindCSS v4 changed its architecture. The PostCSS plugin is now in a separate package `@tailwindcss/postcss` instead of being bundled with `tailwindcss`.

**Solution:**
1. Install the new PostCSS plugin:
   ```bash
   npm install --save-dev @tailwindcss/postcss
   ```

2. Update `postcss.config.js`:
   ```js
   export default {
     plugins: {
       '@tailwindcss/postcss': {},  // Changed from 'tailwindcss'
       autoprefixer: {},
     },
   }
   ```

3. Update `src/index.css` to use v4 syntax:
   ```css
   @import "tailwindcss";  // Instead of @tailwind directives
   ```

**Prevention:**
- When upgrading to TailwindCSS v4, always check for breaking changes in PostCSS configuration
- Review TailwindCSS migration guide before upgrading major versions

---

## Supabase Database Errors

### Database Error Saving New User (Trigger Function)

**Error Message:**
```
Database error saving new user
AuthApiError: Database error saving new user
```

**Root Cause:**
The trigger function `handle_new_user()` that auto-creates profiles when a user signs up is failing due to:
1. Row Level Security (RLS) policies blocking the insert
2. Missing `SET search_path = public` in function definition
3. Function not properly configured with `SECURITY DEFINER`

**Solution:**
1. Update the function to include proper configuration:
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER
   SECURITY DEFINER
   SET search_path = public
   LANGUAGE plpgsql
   AS $$
   BEGIN
       INSERT INTO public.profiles (id, email)
       VALUES (NEW.id, NEW.email)
       ON CONFLICT (id) DO NOTHING;
       RETURN NEW;
   EXCEPTION
       WHEN others THEN
           RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
           RETURN NEW;
   END;
   $$;
   ```

2. Grant execute permissions:
   ```sql
   GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
   GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
   GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
   ```

**Prevention:**
- Always use `SECURITY DEFINER` and `SET search_path = public` for trigger functions that need to bypass RLS
- Add exception handling in trigger functions to prevent user creation from failing
- Test trigger functions after creating them

---

### Migration Policy Already Exists Error

**Error Message:**
```
ERROR: 42710: policy "profiles_select_own" for table "profiles" already exists
```

**Root Cause:**
Running migrations multiple times without checking if policies/triggers already exist.

**Solution:**
Make migrations idempotent by adding `DROP IF EXISTS` before creating:
```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

-- Then create policies
CREATE POLICY profiles_select_own ON public.profiles...
```

**Prevention:**
- Always use `DROP IF EXISTS` before creating policies, triggers, or indexes in migrations
- Use `CREATE OR REPLACE` for functions
- Test migrations by running them multiple times

---

### Migration Error: Relation Does Not Exist

**Error Message:**
```
ERROR: 42P01: relation "public.profiles" does not exist
```

**Root Cause:**
Migration script tries to DROP triggers or functions on a table that doesn't exist yet. The order of DROP statements matters.

**Solution:**
1. Drop the table first (with CASCADE to remove all dependencies):
   ```sql
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```

2. Then drop functions (if they still exist):
   ```sql
   DROP FUNCTION IF EXISTS public.handle_updated_at();
   ```

3. Create the table and dependencies:
   ```sql
   CREATE TABLE public.profiles (...);
   -- Then create triggers, functions, etc.
   ```

**Prevention:**
- Always drop tables before dropping functions/triggers that depend on them
- Use CASCADE when dropping tables to automatically remove dependencies
- Test migration scripts on a clean database

---

### Using Supabase Auth Instead of Custom Profiles Table

**Error Message:**
Users being created in `auth.users` table instead of `profiles` table, violating project rules.

**Root Cause:**
Code was using `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` which creates users in Supabase's default `auth.users` table, but project rules specify not to use Supabase Auth.

**Solution:**
1. Remove all `supabase.auth.*` calls
2. Use bcrypt to hash passwords directly:
   ```js
   import bcrypt from 'bcryptjs';
   const passwordHash = await bcrypt.hash(password, 10);
   ```

3. Insert directly into `profiles` table:
   ```js
   const { data, error } = await supabase
     .from('profiles')
     .insert({
       id: randomUUID(),
       email: normalizedEmail,
       password_hash: passwordHash,
     });
   ```

4. Verify passwords with bcrypt:
   ```js
   const isPasswordValid = await bcrypt.compare(password, profile.password_hash);
   ```

5. Update migration to include `password_hash` column and remove foreign key to `auth.users`

**Prevention:**
- Always check project rules before implementing authentication
- Use custom user management when project specifies not to use default auth tables
- Test that users are created in the correct table after implementation
