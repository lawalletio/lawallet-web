import pluginsConfig from '@/config/pluginsConfig.json';
import { PluginsList } from './components/PluginsList';

const getPluginsInfo = async (): Promise<PluginMetadata[]> => {
  const plugins: PluginMetadata[] = [];

  await Promise.all([
    pluginsConfig.pluginsList.map(async (plugin: { route: string; package: string }) => {
      const metadata = await import(`@/config/exports/extensions/${plugin.route}/metadata.ts`).then(
        (res) => res.default,
      );

      plugins.push({ ...metadata, route: plugin.route });
    }),
  ]);

  return plugins;
};

export default async function Page() {
  const plugins = await getPluginsInfo();
  return <PluginsList plugins={plugins} />;
}
