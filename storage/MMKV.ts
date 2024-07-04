import {MMKV} from 'react-native-mmkv';
import {key, value} from "@/storageKeyValue";

const storage = new MMKV();

storage.clearAll();

storage.set(key, value);

export function getFromMMKV(): string | undefined {
    return storage.getString(key);
}
