import React from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
// import HomepageFeatures from '@site/src/components/HomepageFeatures'
import Translate from '@docusaurus/Translate'
import SearchBar from '@theme-original/SearchBar'
// import BannerCore from '@site/static/img//banner-core.png'
// import BannerIcon from '@site/static/img//banner-icon.png'
import styles from './index.module.css'
import CodeBlock from '@theme/CodeBlock'

function HomepageHeader() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className={'container'}>
                <div className={'row row--align-center'}>
                    <div className={'col col--6  col--offset-1'}>
                        <h1 className={'hero__title'}>
                            <Translate id={'home.advertising.title'}>CodePay Open Docs</Translate>
                        </h1>
                        {/* <div className={styles.heroBannerList}>
              <div>
                <img src={BannerIcon} />
                <Translate id={'home.advertising.subtitle1'}>Simplify</Translate>
              </div>
              <div>
                <img src={BannerIcon} />
                <Translate id={'home.advertising.subtitle2'}>Secure</Translate>
              </div>
              <div>
                <img src={BannerIcon} />
                <Translate id={'home.advertising.subtitle3'}>Accelerate</Translate>
              </div>
            </div> */}
                    </div>
                    <div className={'col col--5'}>
                        {/* <img src={BannerCore} width={'100%'} /> */}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext()
    return (
        <Layout
            title={`${siteConfig.title}`}
            description={'Description will go into a meta tag in <head />'}
        >
            {/* <HomepageHeader /> */}

            <main className={styles.homeMain}>
                <div className={styles.searchBox}>
                    <SearchBar />
                </div>
                {/* <HomepageFeatures /> */}
            </main>
        </Layout>
    )
}
