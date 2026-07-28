import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';

type MapImageViewerProps = {
  asset: any;
  title: string;
  description: string;
  visible: boolean;
  onClose: () => void;
};

export default function MapImageViewer({
  asset,
  title,
  description,
  visible,
  onClose,
}: MapImageViewerProps) {
  const { width, height } = useWindowDimensions();
  const imageWidth = Math.min(width - 32, 1080);
  const imageHeight = Math.max(height - 220, 320);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Maps</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Close ${title}`}
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
          >
            <Feather name="x" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.viewer}
          contentContainerStyle={styles.viewerContent}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          bouncesZoom
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={asset}
            resizeMode="contain"
            style={{ width: imageWidth, height: imageHeight }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#15171B',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    opacity: 0.82,
  },
  viewer: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#090909',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewerContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
});
