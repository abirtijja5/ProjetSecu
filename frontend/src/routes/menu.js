import { 
    VStack, 
    Text, 
    Button, 
    Box, 
    Heading, 
    Divider, 
    Card, 
    CardBody, 
    CardHeader,
    Flex,
    Avatar,
    useColorModeValue,
    Spinner,
    IconButton,
    Badge
  } from "@chakra-ui/react"
  import { FiLogOut, FiBookOpen } from "react-icons/fi"
  import { useEffect, useState } from "react"
  import { get_notes } from "../api/endpoints"
  import { useAuth } from "../context/useAuth"
  
  const Menu = () => {
    const [notes, setNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user, logoutUser } = useAuth()
  
    const bgColor = useColorModeValue('gray.50', 'gray.800')
    const cardBg = useColorModeValue('white', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'gray.200')
  
    useEffect(() => {
      const fetchNotes = async () => {
        try {
          const notes = await get_notes()
          setNotes(notes)
        } catch (error) {
          console.error("Failed to fetch notes:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchNotes()
    }, [])
  
    const handleLogout = async () => {
      await logoutUser()
    }
  
    return (
      <Box p={8} maxW="800px" mx="auto">
        <Flex justify="space-between" align="center" mb={10}>
          <Flex align="center">
            <Avatar 
              name={user?.username} 
              src={user?.avatar} 
              size="lg" 
              mr={4}
              bg="teal.500"
              color="white"
            />
            <Box>
              <Heading as="h1" size="xl">
                Welcome back, {user ? user.username : 'Guest'} 👋
              </Heading>
              <Text color={textColor} fontSize="lg">
                Here are your notes
              </Text>
            </Box>
          </Flex>
          
          <IconButton
            icon={<FiLogOut />}
            aria-label="Logout"
            onClick={handleLogout}
            colorScheme="red"
            variant="outline"
            size="lg"
          />
        </Flex>
  
        <Divider mb={8} />
  
        {isLoading ? (
          <Flex justify="center" py={20}>
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : (
          <VStack spacing={6} align="stretch">
            <Heading size="md">
              <Badge colorScheme="teal" p={2} borderRadius="md">
                Your Notes ({notes.length})
              </Badge>
            </Heading>
  
            {notes.length === 0 ? (
              <Card bg={cardBg} boxShadow="md">
                <CardBody textAlign="center" py={10}>
                  <FiBookOpen size="48px" color="#4FD1C5" style={{ margin: '0 auto 16px' }} />
                  <Text fontSize="lg" color={textColor}>
                    You don't have any notes yet. Create your first note!
                  </Text>
                  <Button mt={4} colorScheme="teal">
                    Create Note
                  </Button>
                </CardBody>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id} bg={cardBg} boxShadow="sm" _hover={{ boxShadow: 'md' }}>
                  <CardHeader pb={0}>
                    <Flex align="center">
                      <Box 
                        w={3} 
                        h={6} 
                        bg="teal.400" 
                        borderRadius="full" 
                        mr={3}
                      />
                      <Heading size="md">{note.name}</Heading>
                    </Flex>
                  </CardHeader>
                  <CardBody pt={2}>
                    <Text color={textColor}>
                      {note.content || "No additional content"}
                    </Text>
                    {note.createdAt && (
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                      </Text>
                    )}
                  </CardBody>
                </Card>
              ))
            )}
          </VStack>
        )}
      </Box>
    )
  }
  
  export default Menu