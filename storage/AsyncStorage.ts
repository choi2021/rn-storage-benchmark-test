import AsyncStorage from '@react-native-async-storage/async-storage';
import {key, value} from "@/storageKeyValue";


AsyncStorage.clear();
AsyncStorage.setItem(key, value);

export async function getFromAsyncStorage(): Promise<string | null> {
    return AsyncStorage.getItem(key);
}
