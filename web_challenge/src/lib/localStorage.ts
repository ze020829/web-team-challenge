import { UserInfo } from '@/types';
import { USER_INFO_KEY } from '@/utils/constants';

/**
 * 检查是否在浏览器环境中
 */
const isBrowser = typeof window !== 'undefined';

/**
 * 保存用户信息到 localStorage
 * @param userInfo 用户信息对象
 */
export const saveUserInfo = (userInfo: Omit<UserInfo, 'createdAt' | 'updatedAt'>): void => {
  if (!isBrowser) return;
  
  try {
    const now = new Date().toISOString();
    const existingInfo = getUserInfo();
    
    const fullUserInfo: UserInfo = {
      ...userInfo,
      createdAt: existingInfo?.createdAt || now,
      updatedAt: now,
    };
    
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(fullUserInfo));
  } catch (error) {
    console.error('Failed to save user info to localStorage:', error);
  }
};

/**
 * 从 localStorage 获取用户信息
 * @returns 用户信息对象或 null
 */
export const getUserInfo = (): UserInfo | null => {
  if (!isBrowser) return null;
  
  try {
    const stored = localStorage.getItem(USER_INFO_KEY);
    if (!stored) return null;
    
    const userInfo = JSON.parse(stored) as UserInfo;
    
    // 验证数据完整性
    if (!userInfo.username || !userInfo.jobTitle) {
      removeUserInfo();
      return null;
    }
    
    return userInfo;
  } catch (error) {
    console.error('Failed to get user info from localStorage:', error);
    removeUserInfo();
    return null;
  }
};

/**
 * 检查用户信息是否存在
 * @returns 是否存在用户信息
 */
export const hasUserInfo = (): boolean => {
  return getUserInfo() !== null;
};

/**
 * 从 localStorage 删除用户信息
 */
export const removeUserInfo = (): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error('Failed to remove user info from localStorage:', error);
  }
};

/**
 * 更新用户信息
 * @param updates 要更新的字段
 */
export const updateUserInfo = (updates: Partial<Omit<UserInfo, 'createdAt' | 'updatedAt'>>): void => {
  const existingInfo = getUserInfo();
  if (!existingInfo) {
    console.warn('No existing user info to update');
    return;
  }
  
  const updatedInfo = {
    username: updates.username || existingInfo.username,
    jobTitle: updates.jobTitle || existingInfo.jobTitle,
  };
  
  saveUserInfo(updatedInfo);
};