import { autoprefixerFeature } from './autoprefixer/index.js';
import { eslintFeature } from './eslint/index.js';
import { reactRouterFeature } from './react-router/index.js';
import { stylelintFeature } from './stylelint/index.js';

export const features = [
    autoprefixerFeature,
    eslintFeature,
    reactRouterFeature,
    stylelintFeature,
];

export const featuresById = new Map(
    features.map((feature) => [feature.id, feature]),
);