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
    Alert,
    AlertIcon,
    Spinner
  } from '@chakra-ui/react'
  import { useState } from 'react';
  import { useAuth } from '../context/useAuth';
  import { useNavigate } from 'react-router-dom';
  import { FiEye, FiEyeOff, FiLogIn, FiArrowRight } from 'react-icons/fi';
  
  const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
  
    const { loginUser } = useAuth();
    const navigate = useNavigate();
  
    const cardBg = useColorModeValue('white', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'gray.200')
    const borderColor = useColorModeValue('gray.200', 'gray.600')
  
    const handleLogin = async () => {
      if (!username || !password) {
        setError('Please fill in all fields')
        return
      }
  
      try {
        setIsLoading(true)
        setError('')
        await loginUser(username, password)
      } catch (err) {
        setError(err.message || 'Login failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleNavigate = () => {
      navigate('/register')
    }
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleLogin()
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
              Welcome Back
            </Heading>
            <Text color={textColor}>Sign in to access your account</Text>
          </Flex>
  
          {error && (
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
  
          <VStack spacing={6}>
            <FormControl>
              <FormLabel htmlFor="username" color={textColor}>Email or Username</FormLabel>
              <Input
                id="username"
                bg={useColorModeValue('gray.50', 'gray.800')}
                size="lg"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="Enter your username or email"
                focusBorderColor="teal.500"
                onKeyPress={handleKeyPress}
              />
            </FormControl>
  
            <FormControl>
              <FormLabel htmlFor="password" color={textColor}>Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  size="lg"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
  
            <Button
              colorScheme="teal"
              size="lg"
              w="100%"
              onClick={handleLogin}
              isLoading={isLoading}
              loadingText="Signing in..."
              spinner={<Spinner size="sm" />}
              rightIcon={<FiLogIn />}
            >
              Sign In
            </Button>
  
            <Flex w="100%" align="center" my={4}>
              <Divider />
              <Text px={4} color={textColor} fontSize="sm">OR</Text>
              <Divider />
            </Flex>
  
            <Button
              variant="outline"
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={handleNavigate}
              rightIcon={<FiArrowRight />}
            >
              Create New Account
            </Button>
  
            <Text 
              mt={4} 
              textAlign="center" 
              color={textColor} 
              fontSize="sm"
              cursor="pointer"
              _hover={{ textDecoration: 'underline', color: 'teal.500' }}
            >
              Forgot password?
            </Text>
          </VStack>
        </Box>
      </Box>
    )
  }
  
  export default Login;