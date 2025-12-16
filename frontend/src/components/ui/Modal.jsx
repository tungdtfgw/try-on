import { cn } from '../../utils/cn';
import Button from './Button';
import Card from './Card';

export default function Modal({
  isOpen,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onCancel}
      />
      <Card
        role="dialog"
        aria-modal="true"
        className={cn('relative w-full max-w-md p-6')}
      >
        <div className="text-lg font-semibold text-brand-grayDark">{title}</div>
        {description ? (
          <p className="mt-2 text-sm text-brand-grayMedium">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}

