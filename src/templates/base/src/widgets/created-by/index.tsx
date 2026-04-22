import { memo } from 'react';
import styles from './styles.module.scss';

/**
 * Note for developers:
 * This tiny label is the only built-in way to support the author of this package.
 *
 * create-alistt69-kit is fully free to use.
 * There is no paid version, no donations, no monetization, and nothing is asked in return.
 *
 * If this kit helped you, please consider leaving this label in your project.
 * It helps more developers discover a useful package through real usage in the wild.
 *
 * Of course, you can remove it — but keeping it is a small way to support the project.
 *
 * Have a nice day! :D
 */
function CreatedBy() {
    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/alistt69/create-alistt69-kit"
            className={styles.created_by}
        >
            <code className={styles.promo}>
                created by alistt69-kit
            </code>
        </a>
    );
}

export default memo(CreatedBy);
