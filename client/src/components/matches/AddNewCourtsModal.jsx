import { Modal, Select } from "antd"
import { useCourts } from "../../hooks/useCourts"
import {  useEffect, useMemo, useState } from "react";

const AddNewCourtsModal = ({ openModal, onCancel, match, onConfirm }) => {

  const {courts} = useCourts();

  const [selectedCourts, setSelectedCourts] = useState([])
  

  const matchLocation = useMemo(() => {
    if(!match || !courts.length) return null;

    return courts.find(
      loc => loc._id === match.location._id
    )
  }, [match, courts]);

  const availableCourts = useMemo(() =>{
    if(!matchLocation) return [];

    const usedCourts = match?.courtNumbers || []


    return matchLocation.courts
      .map(c => c.number)
      .filter(number => !usedCourts.includes(number) )


  }, [matchLocation, match]);

  
  useEffect(() => {
    if(!openModal) setSelectedCourts([])
  }, [openModal])

  


  return (
    <Modal
      open={openModal}
      onCancel={onCancel}
      onOk={() => onConfirm(selectedCourts)}
      title={`Add courts: ${match?.location?.name}`}


    >
      <Select
        mode="multiple"
        placeholder="Select court(s)"
        showSearch
        onChange={setSelectedCourts}
        style={{width: '100%'}}
        value={selectedCourts}
        options={availableCourts.map((cn) => ({
          label: cn,
          value: cn
        }))}
      />

    </Modal>
  )
}

export default AddNewCourtsModal