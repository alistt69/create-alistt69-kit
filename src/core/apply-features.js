import { featuresById } from '../features/index.js';

export async function applyFeatures({ projectPath, selectedFeatureIds }) {
    for (const featureId of selectedFeatureIds) {
        const feature = featuresById.get(featureId);

        if (!feature) {
            throw new Error(`Unknown feature: ${featureId}`);
        }

        await feature.applyFeature({
            projectPath,
        });
    }
}