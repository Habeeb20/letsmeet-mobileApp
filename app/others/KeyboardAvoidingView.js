// components/KeyboardSafeScreen.js
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KeyboardSafeScreen({ children, footer, style }) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, style]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {footer && (
        <View style={{ paddingBottom: insets.bottom, paddingHorizontal: 16 }}>
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}