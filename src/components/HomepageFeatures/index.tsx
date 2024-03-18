import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'
import Link from '@docusaurus/Link'
import { useColorMode } from '@docusaurus/theme-common'
// import TerminalAppImg from '@site/static/img/terminalApp.png'
// import DarkTerminalAppImg from '@site/static/img/darkTerminalApp.png'
// import BackEndImg from '@site/static/img/backEnd.png'
// import DarkBackEndImg from '@site/static/img/darkBackEnd.png'
// import Feature1Img from '@site/static/img/feature1.png'
// import Feature2Img from '@site/static/img/feature2.png'
// import RightSmallImg from '@site/static/img/right-small.png'

interface FeatureItem {
    title: string | JSX.Element
    img: React.ComponentType<React.ComponentProps<'img'>>
    darkImg?: React.ComponentType<React.ComponentProps<'img'>>
    src?: string
    description: JSX.Element | string
    children?: FeatureItem[]
}

const FeatureList: FeatureItem[] = [
    // {
    //     title: 'I am a terminal application developer',
    //     img: TerminalAppImg,
    //     darkImg: DarkTerminalAppImg,
    //     src: '/developmentGuidelines',
    //     description: (
    //         <>
    //           Integrate with CodePay Register
    //         </>
    //     ),
    //     children: [
    //         {
    //             title:'Same-terminal integration',
    //             img: Feature1Img,
    //             description: 'Your app run on a CodePay Terminal or Tablet, and calling CodePay Register app to accept payments'
    //         }, {
    //             title:'Same-terminal integration',
    //             img: Feature2Img,
    //             description: 'Your app run on a CodePay Terminal or Tablet, and calling CodePay Register app to accept payments'
    //         },
    //     ]
    // },
    // {
    //     title: 'I am a back-end system developer',
    //     img: BackEndImg,
    //     darkImg: DarkBackEndImg,
    //     src: '/apiruleOverview',
    //     description: (
    //         <>
    //           Integrate with CodePay Gateway
    //         </>
    //     ),
    // },
]

// function Feature({ key, activeKey ,img, src, title, description }) {
//     return (
//           <div className={clsx(styles.featureCol, key==activeKey?styles.featureActive:'')}>
//               <div className={'text--center'}>
//                   {/*<Link to={s3rc}>*/}
//                       <img className={styles.featureSvg} src={img} />
//                   {/*</Link>*/}
//               </div>
//               <div className={'text--center padding-horiz--md'}>
//                   <h3>{title}</h3>
//                   <div>{description}</div>
//               </div>
//           </div>
//     )
// }

export default function HomepageFeatures(): JSX.Element {
    const { isDarkTheme } = useColorMode()
    const [featureKey, setFeatureKey] = React.useState<number>()
    console.log('isDarkTheme', isDarkTheme)
    return (
        <section className={styles.features}>
            <div className={'container'}>
                <div className={clsx(styles.featureRow)}>
                    {FeatureList.map((item, index: number) => (
                        <div
                            onClick={() => setFeatureKey(index)}
                            className={clsx(
                                styles.featureCol,
                                index == featureKey ? styles.featureActive : ''
                            )}
                        >
                            <div className={'text--center'}>
                                {/*<Link to={s3rc}>*/}
                                {/* <img className={styles.featureSvg} src={isDarkTheme && item.darkImg ? item.darkImg : item.img} /> */}
                                {/*</Link>*/}
                            </div>
                            <div className={'text--center padding-horiz--md'}>
                                <h3>{item.title}</h3>
                                <div>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {featureKey != undefined && (
                <div className={styles.featureSection}>
                    <div className={'container'}>
                        <h1 className={'text--center'}>
                            Choose the integration method for your app
                        </h1>
                        <div className={styles.featureSectionRow}>
                            {FeatureList[featureKey]?.children?.map((item, index: number) => (
                                <div className={styles.featureSectionCol}>
                                    <div className={'text--center'}>
                                        {/* <img className={styles.featureSvg} src={item.img} /> */}
                                    </div>
                                    <div>
                                        <h3>{item.title}</h3>
                                        <div>{item.description}</div>
                                    </div>
                                    <span className={styles.featureSectionView}>
                                        View docs
                                        {/* <img src={RightSmallImg} /> */}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
