import React from 'react';
import { Modal, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { deleteTest } from '../http/TestApi';
import { jwtDecode } from 'jwt-decode';

const ModalTestDelete = ({ open, onClose, test, onTestDeleted }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!test || !test.TestID) {
      message.error(t('no_test_to_delete'));
      onClose();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      message.error(t('requires_authorization'));
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.RoleID !== 2) {
        message.error(t('insufficient_permissions'));
        return;
      }
    } catch (e) {
      message.error(t('access_check_error'));
      return;
    }

    setLoading(true);
    try {
      console.log('Попытка удаления теста с ID:', test.TestID, 'Title:', test.title);
      await deleteTest(test.TestID);
      message.success(t('test_deleted_success'));
      if (onTestDeleted) onTestDeleted(test.TestID);
      onClose();
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || t('unknown_error');
      console.error('Ошибка удаления теста:', {
        testId: test.TestID,
        status,
        message: errorMessage,
      });

      message.error(`${t('error_deleting_test')}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const modalTitle = test && test.title
    ? `${t('delete_test')} "${test.title}"`
    : t('delete_test');

  return (
    <Modal
      open={open}
      title={modalTitle} 
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          {t('cancel')}
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={handleDelete}
          loading={loading}
          disabled={!test}
        >
          {t('delete')}
        </Button>,
      ]}
      className="modal-main"
    >
      {test ? (
        <>
          <p>{t('confirm_delete_test', { title: test.title })}</p>
          <p>{t('action_cannot_be_undone')}</p>
        </>
      ) : (
        <p>{t('no_test_selected')}</p>
      )}
    </Modal>
  );
};

export default ModalTestDelete;