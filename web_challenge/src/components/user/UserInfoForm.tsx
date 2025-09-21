'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useUserInfo } from '@/hooks/useUserInfo';

export interface UserInfoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    username?: string;
    jobTitle?: string;
  };
  isEditing?: boolean;
}

/**
 * 用户信息表单组件
 * 支持新建和编辑模式
 */
export const UserInfoForm: React.FC<UserInfoFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const { saveUser, updateUser, validateUsername, validateJobTitle } = useUserInfo();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    jobTitle: initialData?.jobTitle || '',
  });
  
  const [errors, setErrors] = useState({
    username: '',
    jobTitle: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 实时验证
  const handleInputChange = (field: 'username' | 'jobTitle', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除当前字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    const usernameError = validateUsername(formData.username);
    const jobTitleError = validateJobTitle(formData.jobTitle);
    
    setErrors({
      username: usernameError || '',
      jobTitle: jobTitleError || '',
    });
    
    return !usernameError && !jobTitleError;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (isEditing) {
        success = await updateUser(formData);
      } else {
        success = await saveUser(formData);
      }
      
      if (success) {
        toast({
          title: isEditing ? '信息更新成功' : '信息保存成功',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // 立即调用成功回调，确保模态框关闭
        setTimeout(() => {
          onSuccess?.();
        }, 0);
      } else {
        toast({
          title: '操作失败',
          description: '请检查输入信息是否正确',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: '操作失败',
        description: '发生未知错误，请重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" textAlign="center" mb={2}>
          {isEditing ? '编辑用户信息' : '请填写用户信息'}
        </Text>
        
        <FormControl isInvalid={!!errors.username} isRequired>
          <FormLabel>用户名</FormLabel>
          <Input
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="请输入用户名"
            size="lg"
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={!!errors.jobTitle} isRequired>
          <FormLabel>职位</FormLabel>
          <Input
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="请输入职位"
            size="lg"
          />
          <FormErrorMessage>{errors.jobTitle}</FormErrorMessage>
        </FormControl>
        
        <VStack spacing={3} pt={4}>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={isSubmitting}
            loadingText={isEditing ? '更新中...' : '保存中...'}
          >
            {isEditing ? '更新信息' : '保存信息'}
          </Button>
          
          {onCancel && (
            <Button
              variant="ghost"
              size="lg"
              width="full"
              onClick={onCancel}
              isDisabled={isSubmitting}
            >
              取消
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default UserInfoForm;