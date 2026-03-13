import { Modal, Select, InputNumber, Space, Typography } from "antd";
import { useCourts } from "../../hooks/useCourts";
import { useEffect, useMemo, useState } from "react";

const AddNewCourtsModal = ({ openModal, onCancel, match, onConfirm }) => {
  const { Text } = Typography;
  const { courts } = useCourts();

  const [selectedCourts, setSelectedCourts] = useState([]);
  const [courtPrices, setCourtPrices] = useState({});

  const matchLocation = useMemo(() => {
    if (!match || !courts.length) return null;

    return courts.find((loc) => loc._id === match?.location?._id);
  }, [match, courts]);

  const usedCourtNumbers = useMemo(() => {
    if (!match) return [];

    if (Array.isArray(match.courts)) {
      return match.courts.map((c) => Number(c.courtNumber));
    }

    return Array.isArray(match.courtNumbers)
      ? match.courtNumbers.map(Number)
      : [];
  }, [match]);

  const availableCourts = useMemo(() => {
    if (!matchLocation) return [];

    return matchLocation.courts
      .map((c) => c.number)
      .filter((number) => !usedCourtNumbers.includes(number));
  }, [matchLocation, usedCourtNumbers]);

  useEffect(() => {
    if (!openModal) {
      setSelectedCourts([]);
      setCourtPrices({});
    }
  }, [openModal]);

  const handleChangeCourtSelection = (newSelection) => {
    setSelectedCourts(newSelection);

    setCourtPrices((prev) => {
      const next = {};
      newSelection.forEach((cn) => {
        next[cn] = prev[cn] ?? null;
      });
      return next;
    });
  };

  const handlePriceChange = (courtNumber, value) => {
    setCourtPrices((prev) => ({
      ...prev,
      [courtNumber]: value,
    }));
  };

  const handleConfirm = () => {
    const courtsPayload = selectedCourts.map((courtNumber) => ({
      courtNumber: Number(courtNumber),
      price: Number(courtPrices[courtNumber]),
    }));

    onConfirm(courtsPayload);
  };

  const hasMissingPrices =
    selectedCourts.length > 0 &&
    selectedCourts.some((cn) => {
      const price = Number(courtPrices[cn]);
      return Number.isNaN(price) || price <= 0;
    });

  return (
    <Modal
      open={openModal}
      onCancel={onCancel}
      onOk={handleConfirm}
      okButtonProps={{ disabled: selectedCourts.length === 0 || hasMissingPrices }}
      title={`Add courts: ${match?.location?.name || ""}`}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Select
          mode="multiple"
          placeholder="Select court(s)"
          showSearch
          onChange={handleChangeCourtSelection}
          style={{ width: "100%" }}
          value={selectedCourts}
          options={availableCourts.map((cn) => ({
            label: `Court ${cn}`,
            value: cn,
          }))}
        />

        {selectedCourts.map((courtNumber) => (
          <Space key={courtNumber} align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Text strong>{`Court ${courtNumber}`}</Text>
            <InputNumber
              min={0.01}
              step={0.1}
              precision={2}
              placeholder="Price"
              prefix="€"
              value={courtPrices[courtNumber]}
              onChange={(value) => handlePriceChange(courtNumber, value)}
            />
          </Space>
        ))}
      </Space>
    </Modal>
  );
};

export default AddNewCourtsModal;
