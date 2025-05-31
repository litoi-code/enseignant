import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface TabBarIconProps {
  name: string;
  color: string;
  focused: boolean;
  size?: number;
}

export function TabBarIcon({ name, color, focused, size = 28 }: TabBarIconProps) {
  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      <IconSymbol
        name={name}
        color={color}
        size={size}
        style={[styles.icon, focused && styles.focusedIcon]}
      />
      {focused && <View style={[styles.indicator, { backgroundColor: color }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'relative',
  },
  focusedContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    transform: [{ scale: 1.1 }],
  },
  icon: {
    // Base icon styles
  },
  focusedIcon: {
    // Additional styles for focused state
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  indicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default TabBarIcon;
