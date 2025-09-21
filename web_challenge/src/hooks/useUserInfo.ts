import { useState, useEffect, useCallback } from 'react';
import { UserInfo } from '@/types';
import { 
  getUserInfo, 
  saveUserInfo, 
  hasUserInfo, 
  removeUserInfo, 
  updateUserInfo 
} from '@/lib/localStorage';
import { VALIDATION_RULES } from '@/utils/constants';

export interface UseUserInfoReturn {
  userInfo: UserInfo | null;
  isLoading: boolean;
  hasUser: boolean;
  isAuthenticated: boolean;
  saveUser: (userData: { username: string; jobTitle: string }) => Promise<boolean>;
  updateUser: (updates: Partial<{ username: string; jobTitle: string }>) => Promise<boolean>;
  removeUser: () => void;
  validateUsername: (username: string) => string | null;
  validateJobTitle: (jobTitle: string) => string | null;
}

/**
 * 用户信息管理 Hook
 * 提供用户信息的增删改查功能和表单验证
 */
export const useUserInfo = (): UseUserInfoReturn => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 强制刷新用户信息的方法
  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // 初始化时从 localStorage 加载用户信息
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const info = getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error('Failed to load user info:', error);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [refreshTrigger]); // 添加refreshTrigger依赖

  // 验证用户名
  const validateUsername = useCallback((username: string): string | null => {
    if (!username || username.trim().length === 0) {
      return '用户名不能为空';
    }
    
    const trimmed = username.trim();
    
    if (trimmed.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
      return `用户名至少需要 ${VALIDATION_RULES.USERNAME.MIN_LENGTH} 个字符`;
    }
    
    if (trimmed.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
      return `用户名不能超过 ${VALIDATION_RULES.USERNAME.MAX_LENGTH} 个字符`;
    }
    
    if (!VALIDATION_RULES.USERNAME.PATTERN.test(trimmed)) {
      return '用户名只能包含字母、数字、下划线和中文字符';
    }
    
    return null;
  }, []);

  // 验证职位
  const validateJobTitle = useCallback((jobTitle: string): string | null => {
    if (!jobTitle || jobTitle.trim().length === 0) {
      return '职位不能为空';
    }
    
    const trimmed = jobTitle.trim();
    
    if (trimmed.length < VALIDATION_RULES.JOB_TITLE.MIN_LENGTH) {
      return `职位至少需要 ${VALIDATION_RULES.JOB_TITLE.MIN_LENGTH} 个字符`;
    }
    
    if (trimmed.length > VALIDATION_RULES.JOB_TITLE.MAX_LENGTH) {
      return `职位不能超过 ${VALIDATION_RULES.JOB_TITLE.MAX_LENGTH} 个字符`;
    }
    
    return null;
  }, []);

  // 保存用户信息
  const saveUser = useCallback(async (userData: { username: string; jobTitle: string }): Promise<boolean> => {
    try {
      const usernameError = validateUsername(userData.username);
      const jobTitleError = validateJobTitle(userData.jobTitle);
      
      if (usernameError || jobTitleError) {
        console.error('Validation failed:', { usernameError, jobTitleError });
        return false;
      }
      
      const trimmedData = {
        username: userData.username.trim(),
        jobTitle: userData.jobTitle.trim(),
      };
      
      saveUserInfo(trimmedData);
      
      // 立即更新状态并强制刷新
      const savedInfo = getUserInfo();
      setUserInfo(savedInfo);
      forceRefresh();
      
      return true;
    } catch (error) {
      console.error('Failed to save user info:', error);
      return false;
    }
  }, [validateUsername, validateJobTitle, forceRefresh]);

  // 更新用户信息
  const updateUser = useCallback(async (updates: Partial<{ username: string; jobTitle: string }>): Promise<boolean> => {
    try {
      if (updates.username !== undefined) {
        const usernameError = validateUsername(updates.username);
        if (usernameError) {
          console.error('Username validation failed:', usernameError);
          return false;
        }
        updates.username = updates.username.trim();
      }
      
      if (updates.jobTitle !== undefined) {
        const jobTitleError = validateJobTitle(updates.jobTitle);
        if (jobTitleError) {
          console.error('Job title validation failed:', jobTitleError);
          return false;
        }
        updates.jobTitle = updates.jobTitle.trim();
      }
      
      updateUserInfo(updates);
      const updatedInfo = getUserInfo();
      setUserInfo(updatedInfo);
      
      return true;
    } catch (error) {
      console.error('Failed to update user info:', error);
      return false;
    }
  }, [validateUsername, validateJobTitle]);

  // 删除用户信息
  const removeUser = useCallback(() => {
    try {
      console.log('正在清除用户信息...');
      removeUserInfo();
      setUserInfo(null);
      
      // 强制刷新以确保状态立即更新
      forceRefresh();
      
      console.log('用户信息已清除');
    } catch (error) {
      console.error('Failed to remove user info:', error);
    }
  }, [forceRefresh]);

  return {
    userInfo,
    isLoading,
    hasUser: userInfo !== null,
    isAuthenticated: !isLoading && userInfo !== null,
    saveUser,
    updateUser,
    removeUser,
    validateUsername,
    validateJobTitle,
  };
};

export default useUserInfo;