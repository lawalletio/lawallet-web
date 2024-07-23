'use client';
import BackButton from '@/components/BackButton';
import Subnavbar from '@/components/Layout/Subnavbar';
import SpinnerView from '@/components/Spinner/SpinnerView';
import { Navbar } from '@lawallet/ui';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

type RouteWithParams = {
  component: React.ComponentType<React.JSX.Element>;
  params: Record<string, string>;
  metadata: PluginMetadata;
};

const getPluginView = async (pluginName: string, pathStr: string): Promise<RouteWithParams | null> => {
  const metadata = await import(`@/config/exports/extensions/${pluginName}/metadata.ts`).then((res) => res.default);
  const routes = await import(`@/config/exports/extensions/${pluginName}/routes.tsx`).then((res) => res.default);
  let routeWithParams: RouteWithParams | undefined;

  const existExactMatch = routes.find((route) => route.path === pathStr);
  if (existExactMatch) return { component: existExactMatch.getComponent(), params: {}, metadata };

  for (const route of routes) {
    const { path, getComponent } = route;
    const isDynamicRoute = path.includes(':');

    if (isDynamicRoute) {
      const pattern = path.replace(/:[^/]+/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      const match = pathStr.match(regex);

      if (match) {
        const params: Record<string, string> = {};
        const pathSegments = path.split('/');
        const matchSegments = pathStr.split('/');

        pathSegments.forEach((segment, index) => {
          if (segment.startsWith(':')) {
            const paramName = segment.substring(1);
            params[paramName] = matchSegments[index];
          }
        });

        routeWithParams = { component: getComponent(), params, metadata };
        break;
      }
    } else if (path === pathStr) {
      routeWithParams = { component: getComponent(), params: {}, metadata };
      break;
    }
  }

  if (!routeWithParams) {
    throw new Error('Route not found');
  }

  return routeWithParams;
};

export default function Page({ params }) {
  const router = useRouter();

  const [ComponentInfo, setComponentInfo] = useState<RouteWithParams | null>(null);
  const [pluginRoute, setPluginRoute] = useState<string>('/');

  const pluginName = params.pluginName[0];

  const loadComponent = useCallback(async () => {
    const comp = await getPluginView(pluginName, pluginRoute);
    comp ? setComponentInfo(comp) : router.push('/extensions');
  }, [pluginName, pluginRoute]);

  useEffect(() => {
    if (params.pluginName.length > 1) {
      let pRoute = '';
      params.pluginName.forEach((route: string) => {
        if (route !== pluginName) pRoute = `${pRoute}/${route}`;
      });

      setPluginRoute(pRoute);
    }
  }, [params.pluginName]);

  useEffect(() => {
    loadComponent();
  }, [pluginName, pluginRoute]);

  return ComponentInfo ? (
    <>
      <Navbar title={ComponentInfo.metadata.title} leftButton={<BackButton />} />
      <ComponentInfo.component props={ComponentInfo.params} type="" key="" />
      <Subnavbar path="plugins" />
    </>
  ) : (
    <SpinnerView />
  );
}
