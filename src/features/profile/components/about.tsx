// Packages
import Link from 'next/link';
import { parse, render as renderParsed, isTopic, isLink, isProfile, isNewline } from '@welshman/content';

// Generic components
import { Skeleton } from '@/components/UI/skeleton';
import { Button } from '@/components/UI/button';

// Internal components
import { Mention } from './mention';

export const About = (props: { value: string | undefined }) => {
  const { value } = props;

  if (!value) return <Skeleton className="w-full h-[20px] bg-card rounded-full" />;

  const fullContent = parse({ content: value });

  return (
    <div className="break-words w-full text-sm">
      {fullContent?.length > 0 &&
        fullContent?.map((parsed, i) => {
          if (isNewline(parsed)) {
            return <br key={i} />;
          } else if (isTopic(parsed)) {
            return (
              <Button variant="link" size="lg" className="p-0 h-auto text-white" key={i}>
                #{parsed.value}
              </Button>
            );
          } else if (isLink(parsed)) {
            const url = parsed.value.url.toString();
            const zapcitoRegexp = /^(https?:\/\/)?zapcito\.app/;

            if (url.match(zapcitoRegexp)) {
              return (
                <>
                  <Button className="p-0" key={i} variant="link" size="sm" asChild>
                    <Link href={url.replace(zapcitoRegexp, '')} onClick={(e) => e.stopPropagation()}>
                      {url}
                    </Link>
                  </Button>
                </>
              );
            }
          } else if (isProfile(parsed)) {
            return <Mention key={i} value={parsed.value.pubkey} />;
          } else {
            return <span key={i} dangerouslySetInnerHTML={{ __html: String(renderParsed(parsed)) }} />;
          }
        })}
    </div>
  );
};
