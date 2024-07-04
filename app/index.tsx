import {Button, SafeAreaView,StyleSheet} from "react-native";
import React, {useCallback} from "react";
import {getFromMMKV} from "@/storage/MMKV";
import {getFromAsyncStorage} from "@/storage/AsyncStorage";
import {getFromSQLite} from "@/storage/OpSQLite";
import {getFromWatermelonDB} from "@/storage/WatermelonDB";



const iterations = 1000;


async function benchmark(
    label: string,
    fn: () => unknown | Promise<unknown>,
): Promise<number> {
    try {
        console.log(`Starting Benchmark "${label}"...`);
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            const r = fn();
            if (r instanceof Promise) {
                await r;
            }
        }
        const end = performance.now();
        const diff = end - start;
        console.log(`Finished Benchmark "${label}"! Took ${diff.toFixed(4)}ms!`);
        return diff;
    } catch (e) {
        console.error(`Failed Benchmark "${label}"!`, e);
        return 0;
    }
}

async function waitForGC(): Promise<void> {
    // Wait for Garbage Collection to run. We give a 500ms delay.
    return new Promise(r => setTimeout(r, 500));
}

export default function Index() {
    const runBenchmarks = useCallback(async () => {
        console.log('Running Benchmark in 3... 2... 1...');
        await benchmark('OP-SQLITE         ', getFromSQLite);
        await waitForGC();
        await benchmark('MMKV                 ', getFromMMKV);
        await waitForGC();
        await benchmark('AsyncStorage         ', getFromAsyncStorage);
        await waitForGC();
        await benchmark('WaterMelonDB         ', getFromWatermelonDB);
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <Button title="Run Benchmarks" onPress={runBenchmarks} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
