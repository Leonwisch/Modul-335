import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = width * 0.8; 

export default function SensorDebug() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);


  const historyX = useRef<number[]>([]);
  const n = 10; 

  const smoothValue = (val: number, history: React.MutableRefObject<number[]>) => {
    history.current.push(val);
    if (history.current.length > n) history.current.shift();
    return history.current.reduce((a, b) => a + b, 0) / history.current.length;
  };

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(data => {
      setData({
        x: smoothValue(data.x, historyX), 
        y: data.y,
        z: data.z,
      });
    });
    setSubscription(sub);
  };

  const _unsubscribe = () => {
    subscription?.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const getBarStyle = (val: number) => ({
    width: Math.abs(val) * (BAR_MAX_WIDTH / 2), 
    left: val >= 0 ? BAR_MAX_WIDTH / 2 : (BAR_MAX_WIDTH / 2) - (Math.abs(val) * (BAR_MAX_WIDTH / 2)),
    backgroundColor: val >= 0 ? '#4CAF50' : '#F44336',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Debug</Text>


      <View style={styles.valueRow}>
        <Text style={styles.label}>X: {x.toFixed(3)}</Text>
        <Text style={styles.label}>Y: {y.toFixed(3)}</Text>
        <Text style={styles.label}>Z: {z.toFixed(3)}</Text>
      </View>

      <View style={styles.vizContainer}>
        {['X', 'Y', 'Z'].map((axis, i) => {
          const val = [x, y, z][i];
          return (
            <View key={axis} style={styles.axisWrapper}>
              <Text>{axis}</Text>
              <View style={styles.track}>
                <View style={[styles.bar, getBarStyle(val)]} />
                <View style={styles.centerLine} />
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: subscription ? '#ff4444' : '#44bb44' }]} 
        onPress={subscription ? _unsubscribe : _subscribe}
      >
        <Text style={styles.buttonText}>{subscription ? 'Pause' : 'Resume'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  valueRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
  label: { fontSize: 16, fontFamily: 'monospace' },
  vizContainer: { width: BAR_MAX_WIDTH, marginBottom: 40 },
  axisWrapper: { marginBottom: 15 },
  track: { height: 20, backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden', position: 'relative' },
  bar: { height: '100%', position: 'absolute' },
  centerLine: { position: 'absolute', left: BAR_MAX_WIDTH / 2, width: 2, height: '100%', backgroundColor: '#000', opacity: 0.2 },
  button: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});