import { useEffect, useState } from 'react';
import { ArrowRight, Bell, X } from 'lucide-react';
import { activityItems, type ActivityItem } from '@/data/socialProof';

type PurchaseActivityToastProps = {
  onNavigate: (page: string) => void;
};

const initialDelay = 7000;
const displayDuration = 6500;
const rotationInterval = 18000;

export default function PurchaseActivityToast({ onNavigate }: PurchaseActivityToastProps) {
  const [activity, setActivity] = useState<ActivityItem>(activityItems[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let itemIndex = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const showNext = () => {
      itemIndex = (itemIndex + 1) % activityItems.length;
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
  }, []);

  if (!visible || !activity) return null;

  const target = activity.productId === 'bundle' ? 'bundle' : `product-${activity.productId}`;

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
