// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { AdUnit } from '../config/AdCampaignsConfig';
import colors from '../theme/colors';

interface AdBannerProps {
  adUnit: AdUnit;
  position: 'top' | 'bottom';
  pointerEvents?: 'box-none' | 'none' | 'auto';
}

const AdBanner: React.FC<AdBannerProps> = ({ adUnit, position, pointerEvents = 'auto' }) => {
  if (!adUnit.enabled) return null;

  const handlePress = async () => {
    if (!adUnit.targetUrl) return;
    try {
      const canOpen = await Linking.canOpenURL(adUnit.targetUrl);
      if (canOpen) await Linking.openURL(adUnit.targetUrl);
    } catch (error) {
      console.error('Error opening sponsor URL:', error);
    }
  };

  const isTop = position === 'top';

  return (
    <View style={isTop ? styles.topContainer : styles.bottomContainer} pointerEvents={pointerEvents}>
      <TouchableOpacity
        style={isTop ? styles.topBanner : styles.bottomBanner}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {adUnit.imageUrl ? (
          <Image
            source={{ uri: adUnit.imageUrl }}
            style={isTop ? styles.topBannerImage : styles.bottomBannerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.sponsorEyebrow}>{isTop ? 'Presented By' : 'Sponsor Spotlight'}</Text>
            <Text style={styles.sponsorName}>{adUnit.name}</Text>
            <Text style={styles.sponsorText}>{adUnit.placeholderText}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '4%',
    marginTop: 10,
  },
  topBanner: {
    width: '100%',
    height: 82,
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '4%',
  },
  bottomBanner: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  sponsorEyebrow: {
    color: colors.field,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sponsorName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 2,
  },
  sponsorText: {
    color: '#D1D5DB',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  topBannerImage: { width: '100%', height: 82 },
  bottomBannerImage: { width: '100%', height: 50 },
});

export default AdBanner;
