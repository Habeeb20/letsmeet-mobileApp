import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPost, commentOnPost } from '../constants/api';
import colors from '../colors';

const CommentsModal = ({ visible, onClose, postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && postId) {
      fetchComments();
    }
  }, [visible, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getPost(postId);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await commentOnPost(postId, newComment.trim()); // Send string instead of object
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentAuthor}>
        {item.author?.firstName || 'Unknown'} {item.author?.lastName || ''}
      </Text>
      <Text style={styles.commentText}>{item.content}</Text>
      <Text style={styles.commentTime}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments ({comments.length})</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.heartblue}
            style={styles.loadingSpinner}
          />
        )}
        <FlatList
          data={comments}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderComment}
          style={styles.commentsList}
          ListEmptyComponent={<Text style={styles.emptyText}>No comments yet</Text>}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            onPress={addComment}
            disabled={loading || !newComment.trim()}
            style={styles.sendButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.buttonText} />
            ) : (
              <Icon name="send" size={24} color={colors.buttonText} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  commentsList: {
    flex: 1,
    padding: 8,
  },
  commentItem: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: colors.heartblue,
    marginBottom: 4,
  },
  commentText: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  commentTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 20,
    marginRight: 8,
    color: colors.textPrimary,
  },
  sendButton: {
    backgroundColor: colors.heartblue,
    padding: 8,
    borderRadius: 20,
  },
  loadingSpinner: {
    marginVertical: 20,
  },
});

export default CommentsModal;