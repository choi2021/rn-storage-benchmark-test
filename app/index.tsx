import {Button, SafeAreaView, StyleSheet, View,Text} from "react-native";
import React, {useCallback, useState} from "react";
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
        const result =+diff.toFixed(4)
        console.log(`Finished Benchmark "${label}"! Took ${result}ms!`);
        return result;
    } catch (e) {
        console.error(`Failed Benchmark "${label}"!`, e);
        return 0;
    }
}

const getFromStorage=(type:StorageType)=>{
    switch (type) {
        case 'op-sqlite':
            return getFromSQLite;
        case 'mmkv':
            return getFromMMKV;
        case 'async-storage':
            return getFromAsyncStorage;
        case 'watermelonDB':
            return getFromWatermelonDB;
    }
}

type StorageType = 'op-sqlite' | 'mmkv' | 'async-storage' | 'watermelonDB';

const storageTypes: StorageType[] = ['op-sqlite', 'mmkv', 'async-storage', 'watermelonDB'];



export default function Index() {
    const [result,setResult] = useState<Record<StorageType, number>>(
        storageTypes.reduce((acc, type) => ({...acc, [type]: 0}), {} as Record<StorageType, number>)
    );



    const runBenchmarks = useCallback(async () => {

        const values = await Promise.all(storageTypes.map(async (type) => {
            return benchmark(`${type}       `, getFromStorage(type));
        }))

        const newResult = storageTypes.reduce((acc, type, index) => ({...acc, [type]: values[index]}), {} as Record<StorageType, number>);
        setResult(newResult);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.resultContainer}>
                {Object.keys(result).map((key) => (
                    <Text key={key} style={styles.resultText}>{key}: {result[key as StorageType]}ms</Text>
                ))}
            </View>

            <View>
                <Button title="Run Benchmarks" onPress={runBenchmarks} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'space-between', alignItems: 'center'},
    resultContainer:{
        justifyContent:'center',
        flex:1
    },
    resultText:{fontSize:20}
});
