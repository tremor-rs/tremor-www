import React from 'react';
import Layout from '@theme/Layout';
import BenchmarkChart from "../components/Benchmark.js";
import { useEffect, useState } from "react";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

export default function Home() {
    const { siteConfig } = useDocusaurusContext();

    const [datas, setDatas] = useState([]);
    useEffect(() => {
        fetch(
            siteConfig.customFields.bench_url
        ).then((response) => {
            return response.json();
        }).then((result) => {
            setDatas(result);
        });
    }, []);
    let history = {};

    datas.forEach(function (entry) {

        let name = entry.bench_name;
        history[name] = history[name] || {
            mbps: [],
            eps: [],
            commits: []
        };
        history[name].mbps.push(entry.mbps);
        history[name].eps.push(entry.eps);
        history[name].mbps.push(entry.mbps);

    });

    window.snot = history;
    const charList = Object.keys(history).map((name) => (
        <div>
            <h2>{name}</h2>
            <BenchmarkChart
                mbps={history[name].mbps.slice(-20)}
                eps={history[name].eps.slice(-20)}
                commitList={history[name].commits.slice(-20)}
                title={name}
            />
        </div>
    ));

    // return (
    //     <Layout
    //         title="Benchmarks"
    //         description="Description will go into a meta tag in <head />">
    //         <HomepageHeader />
    //         <main className="container mx-auto lg:px-80 px-4">
    //             <h1 className="text-center font-bold lg:text-5xl text-3xl pb-8 pt-6">
    //                 Tremor Benchmarks
    //             </h1>
    //             <div>{charList}</div>
    //         </main>
    //     </Layout >
    // );

    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <main>
                <h1 className="text-center font-bold lg:text-5xl text-3xl pb-8 pt-6">
                    Tremor Benchmarks
                </h1>
                <div>{charList}</div>
            </main>
        </Layout>
    );

}
