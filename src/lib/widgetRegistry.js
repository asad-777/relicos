import ClockWidget from '@/components/Widgets/ClockWidget';
import WeatherWidget from '@/components/Widgets/WeatherWidget';

export const WIDGET_REGISTRY = {
  clock: {
    id: 'clock',
    component: ClockWidget,
    defaultX: 64,
    defaultY: 200,
  },
  weather: {
    id: 'weather',
    component: WeatherWidget,
    defaultX: 64,
    defaultY: 450,
  }
};
