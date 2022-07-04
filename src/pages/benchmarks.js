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
        history[name].commits.push(entry.commit_hash);
    });

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

    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <main>
                <h1 className="text-center font-bold lg:text-5xl text-3xl pb-8 pt-6">
                    Tremor Benchmarks
                </h1>
                <p>
                    Here you can track "live" benchmarks of the Tremor runtime for every PR that is
                    merged into the main branch. The benchmarks are run on the same machine to allow
                    them to be compared easily.<br />
                    This allows comparing and tracking the performance progression of Tremor over
                    time. Clicking on a node will show the related commit hash.
                </p>
                <p><b>Note:</b>Entries with 0 eps/mbps indicate failed benchmark runs.</p>
                <div>{charList}</div>
            </main>
        </Layout>
    );

}
