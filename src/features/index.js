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

export const featurePromptOptions = features.map((feature) => ({
    value: feature.id,
    label: feature.title,
    hint: feature.hint,
}));

export const defaultFeatureIds = features.map((feature) => feature.id);

export const availableFeatureIdSet = new Set(defaultFeatureIds);