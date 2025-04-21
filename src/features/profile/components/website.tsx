// Packages
import { Link2Icon } from '@radix-ui/react-icons';

// Libs and hooks
import { extractDomain, normalizeUrl } from '@/lib/utils';

// Generic components
import { Button } from '@/components/UI/button';
import { Skeleton } from '@/components/UI/skeleton';
import { Link } from '@/navigation';

export const Website = (props: { value: string | undefined }) => {
  const { value } = props;

  if (!value) return <Skeleton className="w-full h-[20px] bg-card rounded-full" />;

  return (
    <Link href={normalizeUrl(value)} title={value} target="_blank" tabIndex={-1} rel="nofollow">
      <Button size="sm" variant="link" className="text-left p-0 gap-2">
        <Link2Icon className="w-4 h-4 text-muted-foreground" />
        <span className="truncate overflow-hidden w-full lg:max-w-[200px] whitespace-nowrap">
          {extractDomain(value)}
        </span>
      </Button>
    </Link>
  );
};
