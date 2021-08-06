import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Connectivity',
    Svg: require('../../static/img/cncf-color.svg').default,
    description: (
      <>
        Connecting different systems is an integral part of Tremor. Tremor connects to the external systems using connectors.
      </>
    ),
  },
  {
    title: 'Tooling',
    Svg: require('../../static/img/cncf-color.svg').default,
    description: (
      <>
        Tooling is a first class concern for tremor. From the very beginning, effort went into making errors and warning informative and not leaving users with stack traces, or cryptic output; developer and operator friendliness are front and center. 
      </>
    ),
  },
  {
    title: 'Customisation',
    Svg: require('../../static/img/cncf-color.svg').default,
    description: (
      <>
        Operators allow for highly custom behaviour.
      </>
    ),
  },
  {
    title: 'Scriptable',
    Svg: require('../../static/img/cncf-color.svg').default,
    description: (
      <>
      Tremor's application logic is scriptable.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
