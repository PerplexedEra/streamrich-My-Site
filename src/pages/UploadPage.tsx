import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.space[6]};
  text-align: center;
`;

const UploadCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: ${({ theme }) => theme.space[8]};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }
  
  &.active {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.primary};
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Subtext = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: ${({ theme }) => `${theme.space[6]} 0`};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  span {
    padding: 0 ${({ theme }) => theme.space[4]};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0 auto;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin: ${({ theme }) => `${theme.space[4]} 0`};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-top: ${({ theme }) => theme.space[6]};
`;

export const UploadPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'entertainment',
    isPaid: false,
    price: '',
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Process the uploaded files
      console.log('Files dropped:', files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process the selected files
      console.log('Files selected:', files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Container>
      <Title>Upload Your Content</Title>
      
      <UploadCard 
        className={isDragging ? 'active' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon>📤</UploadIcon>
        <UploadText>Drag and drop your video or audio file here</UploadText>
        <Subtext>Or click to browse files (MP4, WebM, MP3, WAV)</Subtext>
        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={handleFileSelect}
          accept="video/*,audio/*"
        />
        <Button as="label" htmlFor="file-upload">
          Select Files
        </Button>
      </UploadCard>
      
      <OrDivider>
        <span>OR</span>
      </OrDivider>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a title that describes your content"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea 
            id="description" 
            name="description" 
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell viewers about your content"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="category">Category *</Label>
          <Select 
            id="category" 
            name="category" 
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="entertainment">Entertainment</option>
            <option value="education">Education</option>
            <option value="music">Music</option>
            <option value="gaming">Gaming</option>
            <option value="news">News</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <CheckboxContainer>
          <Checkbox 
            type="checkbox" 
            id="isPaid" 
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleInputChange}
          />
          <CheckboxLabel htmlFor="isPaid">
            This is premium content (viewers will pay to watch/listen)
          </CheckboxLabel>
        </CheckboxContainer>
        
        {formData.isPaid && (
          <FormGroup>
            <Label htmlFor="price">Price (in StreamRich coins)</Label>
            <Input 
              type="number" 
              id="price" 
              name="price" 
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price in coins"
              min="0"
              step="1"
            />
          </FormGroup>
        )}
        
        <CheckboxContainer>
          <Checkbox 
            type="checkbox" 
            id="terms" 
            required
          />
          <CheckboxLabel htmlFor="terms">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and 
            <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a> *
          </CheckboxLabel>
        </CheckboxContainer>
        
        <SubmitButton type="submit">
          Upload Content
        </SubmitButton>
      </form>
    </Container>
  );
};

export default UploadPage;
