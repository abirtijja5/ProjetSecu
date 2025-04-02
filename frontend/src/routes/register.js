import {
    FormControl,
    FormLabel,
    Button,
    VStack,
    Input,
    Text,
    Box,
    Heading,
    Flex,
    Divider,
    useColorModeValue,
    InputGroup,
    InputRightElement,
    IconButton,
    InputLeftElement,
    Alert,
    AlertIcon,
    Spinner,
    Checkbox,
    Link
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { useAuth } from '../context/useAuth'
  import { useNavigate } from 'react-router-dom'
  import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'
  
  const Register = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
  
    const { registerUser } = useAuth()
    const navigate = useNavigate()
  
    const cardBg = useColorModeValue('white', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'gray.200')
    const borderColor = useColorModeValue('gray.200', 'gray.600')
  
    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  
    const handleRegister = async () => {
      if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm) {
        setError('Please fill in all fields')
        return
      }
  
      if (formData.password !== formData.passwordConfirm) {
        setError('Passwords do not match')
        return
      }
  
      if (!acceptedTerms) {
        setError('You must accept the terms and conditions')
        return
      }
  
      try {
        setIsLoading(true)
        setError('')
        await registerUser(formData.username, formData.email, formData.password, formData.passwordConfirm)
        navigate('/') 
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleNavigate = () => {
      navigate('/login')
    }
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleRegister()
      }
    }
  
    return (
      <Box
        w="100%"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue('gray.50', 'gray.900')}
        p={4}
      >
        <Box
          bg={cardBg}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          w="100%"
          maxW="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex direction="column" align="center" mb={8}>
            <Heading as="h1" size="xl" mb={2} color="teal.500">
              Create Account
            </Heading>
            <Text color={textColor}>Join us today!</Text>
          </Flex>
  
          {error && (
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
  
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="username" color={textColor}>Username</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <FiUser />
                </InputLeftElement>
                <Input
                  id="username"
                  name="username"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  size="lg"
                  onChange={handleChange}
                  value={formData.username}
                  type="text"
                  placeholder="Choose a username"
                  focusBorderColor="teal.500"
                  onKeyPress={handleKeyPress}
                />
              </InputGroup>
            </FormControl>
  
            <FormControl>
              <FormLabel htmlFor="email" color={textColor}>Email</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <FiMail />
                </InputLeftElement>
                <Input
                  id="email"
                  name="email"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  size="lg"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  placeholder="your@email.com"
                  focusBorderColor="teal.500"
                  onKeyPress={handleKeyPress}
                />
              </InputGroup>
            </FormControl>
  
            <FormControl>
              <FormLabel htmlFor="password" color={textColor}>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <FiLock />
                </InputLeftElement>
                <Input
                  id="password"
                  name="password"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  size="lg"
                  onChange={handleChange}
                  value={formData.password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  focusBorderColor="teal.500"
                  onKeyPress={handleKeyPress}
                />
                <InputRightElement h="full">
                  <IconButton
                    variant="ghost"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
  
            <FormControl>
              <FormLabel htmlFor="passwordConfirm" color={textColor}>Confirm Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  <FiLock />
                </InputLeftElement>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  size="lg"
                  onChange={handleChange}
                  value={formData.passwordConfirm}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  focusBorderColor="teal.500"
                  onKeyPress={handleKeyPress}
                />
                <InputRightElement h="full">
                  <IconButton
                    variant="ghost"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
  
            <FormControl>
              <Checkbox
                isChecked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                colorScheme="teal"
                size="md"
              >
                <Text fontSize="sm" color={textColor}>
                  I agree to the <Link color="teal.500" href="#">Terms and Conditions</Link>
                </Text>
              </Checkbox>
            </FormControl>
  
            <Button
              colorScheme="teal"
              size="lg"
              w="100%"
              onClick={handleRegister}
              isLoading={isLoading}
              loadingText="Creating account..."
              spinner={<Spinner size="sm" />}
              mt={4}
            >
              Register
            </Button>
  
            <Divider my={4} />
  
            <Flex align="center">
              <Text color={textColor} mr={2}>Already have an account?</Text>
              <Button
                variant="link"
                colorScheme="teal"
                rightIcon={<FiArrowLeft />}
                onClick={handleNavigate}
              >
                Sign In
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Box>
    )
  }
  
  export default Register