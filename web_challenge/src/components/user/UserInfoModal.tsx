'use client';

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Icon,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { UserInfoForm } from './UserInfoForm';

export interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  forceClose?: () => void;
  title?: string;
  description?: string;
  allowClose?: boolean;
}

/**
 * 用户信息收集模态框组件
 * 用于阻挡未填写用户信息的用户访问其他页面
 */
export const UserInfoModal: React.FC<UserInfoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  forceClose,
  title = '欢迎使用',
  description = '为了更好地为您服务，请先填写基本信息',
  allowClose = false,
}) => {
  const handleSuccess = () => {
    onSuccess?.();
    forceClose?.(); // 使用强制关闭方法
    onClose();
  };

  const handleClose = () => {
    if (allowClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={allowClose}
      closeOnEsc={allowClose}
      isCentered
      size={{ base: 'sm', md: 'md' }}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent mx={4}>
        <ModalHeader pb={2}>
          <Box display="flex" alignItems="center" gap={3}>
            <Icon as={InfoIcon} color="blue.500" boxSize={6} />
            <Text fontSize="xl" fontWeight="bold">
              {title}
            </Text>
          </Box>
        </ModalHeader>
        
        {allowClose && <ModalCloseButton />}
        
        <ModalBody pb={6}>
          <Box mb={4}>
            <Text color="gray.600" fontSize="sm">
              {description}
            </Text>
          </Box>
          
          <UserInfoForm
            onSuccess={handleSuccess}
            onCancel={allowClose ? onClose : undefined}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserInfoModal;