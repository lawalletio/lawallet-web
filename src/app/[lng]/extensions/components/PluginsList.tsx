'use client';

import BackButton from '@/components/BackButton';
import Subnavbar from '@/components/Layout/Subnavbar';
import { ArrowRightIcon, Button, Card, Container, Divider, Flex, Icon, Navbar, Text } from '@lawallet/ui';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

export function PluginsList({ plugins }: { plugins: PluginMetadata[] }) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <>
      <Navbar leftButton={<BackButton />} title="Plugins" />
      <Container size="small">
        <Divider y={24} />
        {!plugins.length ? (
          <Text align="center">{t('PLUGINS_EMPTY')}</Text>
        ) : (
          plugins.map((value) => {
            return (
              <React.Fragment key={value.route}>
                <Card>
                  <Flex gap={16} justify="space-between" align="center">
                    <div>
                      <Text isBold>{value.title}</Text>
                      <Text>{value.description}</Text>
                    </div>
                    <div>
                      <Button onClick={() => router.push(`/extensions/${value.route}`)} variant="borderless">
                        <Icon>
                          <ArrowRightIcon />
                        </Icon>
                      </Button>
                    </div>
                  </Flex>
                </Card>
                <Divider y={16} />
              </React.Fragment>
            );
          })
        )}
        <Divider y={8} />
      </Container>

      <Subnavbar path="plugins" />
    </>
  );
}
