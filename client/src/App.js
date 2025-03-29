import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
} from '@chakra-ui/react';
import axios from 'axios';

// Utility functions
const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const parseCurrency = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(/[^0-9]/g, ''));
};

// Sample data for dropdowns
const TREATMENT_OPTIONS = [
  'Pemeriksaan Umum',
  'Konsultasi Spesialis',
  'Tes Darah',
  'Rontgen',
  'Fisioterapi',
  'Pemeriksaan Jantung'
];

const MEDICATION_OPTIONS = [
  'Paracetamol',
  'Amoxicillin',
  'Ibuprofen',
  'Omeprazole',
  'Cetirizine',
  'Metformin'
];

function App() {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    treatmentDate: '',
    treatmentDescription: [],
    prescribedMedication: [],
    treatmentCost: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, values) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseCurrency(value); // Parse the input to numeric value
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.patientName || !formData.patientId || !formData.treatmentDate) {
        throw new Error('Harap isi semua bidang yang wajib diisi');
      }
      if (formData.treatmentDescription.length === 0) {
        throw new Error('Harap pilih setidaknya satu deskripsi perawatan');
      }
      if (formData.prescribedMedication.length === 0) {
        throw new Error('Harap pilih setidaknya satu obat yang diresepkan');
      }
      if (!formData.treatmentCost || formData.treatmentCost <= 0) {
        throw new Error('Harap masukkan biaya pengobatan yang valid');
      }

      await axios.post('http://localhost:5000/api/treatments', formData);
      
      toast({
        title: 'Data berhasil disimpan',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        patientName: '',
        patientId: '',
        treatmentDate: '',
        treatmentDescription: [],
        prescribedMedication: [],
        treatmentCost: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menyimpan data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nama Pasien</FormLabel>
            <Input
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Masukkan nama pasien"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>ID Pasien</FormLabel>
            <Input
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="Masukkan ID pasien"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Tanggal Perawatan</FormLabel>
            <Input
              type="date"
              name="treatmentDate"
              value={formData.treatmentDate}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Deskripsi Perawatan</FormLabel>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} width="full">
                Pilih Deskripsi Perawatan
              </MenuButton>
              <MenuList>
                <MenuOptionGroup
                  type="checkbox"
                  value={formData.treatmentDescription}
                  onChange={(values) => handleDropdownChange('treatmentDescription', values)}
                >
                  {TREATMENT_OPTIONS.map(option => (
                    <MenuItemOption key={option} value={option}>
                      {option}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Obat yang Diresepkan</FormLabel>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} width="full">
                Pilih Obat yang Diresepkan
              </MenuButton>
              <MenuList>
                <MenuOptionGroup
                  type="checkbox"
                  value={formData.prescribedMedication}
                  onChange={(values) => handleDropdownChange('prescribedMedication', values)}
                >
                  {MEDICATION_OPTIONS.map(option => (
                    <MenuItemOption key={option} value={option}>
                      {option}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Biaya Pengobatan</FormLabel>
            <Input
              type="text"
              name="treatmentCost"
              value={formatCurrency(formData.treatmentCost)} // Format as Rupiah
              onChange={handleCurrencyChange}
              placeholder="Masukkan biaya pengobatan"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Menyimpan..."
            width="full"
          >
            Simpan Data Perawatan
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default App;