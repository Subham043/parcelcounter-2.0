import { registerPlugin } from '@capacitor/core';

export interface MyPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}

const MyPlugin = registerPlugin<MyPlugin>('MyPlugin');

export default MyPlugin;
