import { useEffect, useState } from 'react';
import { ArrowRight, Bell, X } from 'lucide-react';
import { activityItems, type ActivityItem } from '@/data/socialProof';
import { getProductById, bundle } from '@/data/products';

type PurchaseActivityToastProps = {
  onNavigate: (page: string) => void;
};

const initialDelay = 7000;
const displayDuration = 6500;
const rotationInterval = 18000;

// Random index, never the same one twice in a row.
function pickNextIndex(current: number, length: number) {
  if (length <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export default function PurchaseActivityToast({ onNavigate }: PurchaseActivityToastProps) {
  const [activity, setActivity] = useState<ActivityItem>(
    activityItems[Math.floor(Math.random() * activityItems.length)]
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let itemIndex = activityItems.indexOf(activity);
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const showNext = () => {
      itemIndex = pickNextIndex(itemIndex, activityItems.length);
      setActivity(activityItems[itemIndex]);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), displayDuration);
    };

    const initialTimer = setTimeout(() => {
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), displayDuration);
    }, initialDelay);
    const rotationTimer = setInterval(showNext, rotationInterval);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearInterval(rotationTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible || !activity) return null;

  // Build the real route: bundle goes to /bundle, everything else needs the
  // product's URL slug (not its short id) or it 404s.
  const product = getProductById(activity.productId);
  const target = activity.productId === bundle.id ? 'bundle' : product ? `product-${product.slug}` : 'shop';

  return (
    <aside className="activity-toast" role="status" aria-live="polite" aria-label="Example activity">
      <div className="activity-toast-icon" aria-hidden="true">
        <Bell size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="activity-toast-label">Example activity</p>
        <p className="activity-toast-copy">
          {activity.displayName} in {activity.location} is exploring
          <span className="activity-toast-product"> {activity.productLabel}</span>
        </p>
        <button type="button" className="activity-toast-link" onClick={() => onNavigate(target)}>
          Explore product <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className="activity-toast-close"
        onClick={() => setVisible(false)}
        aria-label="Dismiss example activity"
        title="Dismiss"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  );
}
