import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTid, setSearchTid] = useState('');
  const { control, handleSubmit, reset } = useForm<Omit<TaxPayer, 'tid'>>();

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getTaxPayers();
      setTaxPayers(result.map(tp => ({ ...tp, tid: Number(tp.tid) })));
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  const onSubmit = async (data: Omit<TaxPayer, 'tid'>) => {
    setLoading(true);
    try {
      await backend.addTaxPayer(data.firstName, data.lastName, data.address);
      reset();
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error adding tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTid) return;
    setLoading(true);
    try {
      const result = await backend.searchTaxPayer(BigInt(searchTid));
      if (result) {
        setTaxPayers([{ ...result, tid: Number(result.tid) }]);
      } else {
        setTaxPayers([]);
      }
    } catch (error) {
      console.error('Error searching tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Search by TID"
            variant="outlined"
            value={searchTid}
            onChange={(e) => setSearchTid(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleSearch}>Search</Button>
          <Button variant="outlined" onClick={fetchTaxPayers} sx={{ ml: 2 }}>Show All</Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataTable
            title="TaxPayer Records"
            columns={columns}
            data={taxPayers}
            pagination
            responsive
          />
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Add New TaxPayer</Typography>
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Add TaxPayer
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
