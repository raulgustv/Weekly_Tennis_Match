import { Row, Typography, Col } from "antd";
import { useCourts } from "../../hooks/useCourts";
import CourtForm from "../../components/courts/CourtForm";
import CourtTable from "../../components/courts/CourtTable";
import axiosInstance from "../../API/axios";
import { toast } from "react-toastify";
import { useState } from "react";

const AddCourt = () => {
  const { courts, loadCourts, fetchCourts } = useCourts();
  const [loading, setLoading] = useState(false);

  const { Title, Text } = Typography;

  const createCourt = async (values) => {
    try {
      setLoading(true);
      await axiosInstance.post("/location/new", values);
      toast.success("Court added successfully");
      fetchCourts();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Locations
        </Title>
        <Text type="secondary">
          Manage tennis court locations and available courts
        </Text>
      </div>

      <Row gutter={[24, 24]} align="top">
        <Col xs={24} md={10} lg={8}>
          <CourtForm onCreate={createCourt} loading={loading} />
        </Col>

        <Col xs={24} md={14} lg={16}>
          <CourtTable
            courts={courts}
            loadCourts={loadCourts}
            onRefresh={fetchCourts}
          />
        </Col>
      </Row>
    </>
  );
};

export default AddCourt;
