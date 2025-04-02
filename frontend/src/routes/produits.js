import { 
  VStack, 
  Text, 
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
  Button,
  Badge
} from "@chakra-ui/react"
import { FiLogOut, FiShoppingCart } from "react-icons/fi"
import { useEffect, useState } from "react"
import { get_produits } from "../api/endpoints"
import { useAuth } from "../context/useAuth"
import { useNavigate } from 'react-router-dom';  // Ajoute cette ligne

const Produits = () => {
  const [produits, setProduits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate(); 
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const produits = await get_produits()
        setProduits(produits)
      } catch (error) {
        console.error("Échec de la récupération des produits:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduits()
  }, [])

  const handleLogout = async () => {
    await logoutUser()
  }

  return (
    <Box minHeight="100vh" minWidth={'100vh'} bg={bgColor} p={6}>

  
      <Flex justify="space-between" align="center" mb={8}>
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
              Bienvenue, {user ? user.username : 'Invité'} 👋
            </Heading>
            <Text color={textColor} fontSize="lg" mt={2}>
              Voici la liste des produits disponibles
            </Text>
          </Box>
        </Flex>
        
        <IconButton
          icon={<FiLogOut />}
          aria-label="Déconnexion"
          onClick={handleLogout}
          colorScheme="red"
          variant="outline"
          size="lg"
        />
      </Flex>

      <Divider mb={8} />

      {isLoading ? (
        <Flex justify="center" align="center" height="70vh">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : (
        <VStack spacing={8} align="stretch">
          <Heading size="lg" textAlign="center">
            <Badge colorScheme="teal" p={2} borderRadius="md">
              Produits disponibles ({produits.length})
            </Badge>
          </Heading>

          {produits.length === 0 ? (
            <Card bg={cardBg} boxShadow="md" borderRadius="lg" p={5} textAlign="center">
              <CardBody>
                <FiShoppingCart size="48px" color="#4FD1C5" style={{ margin: '0 auto 16px' }} />
                <Text fontSize="lg" color={textColor}>
                  Aucun produit disponible pour le moment.
                </Text>
              </CardBody>
            </Card>
          ) : (
            produits.map((produit) => (
              <Card key={produit.id} bg={cardBg} boxShadow="lg" _hover={{ boxShadow: 'xl' }} borderRadius="lg" p={5}>
                <CardHeader pb={0}>
                  <Flex align="center">
                    <Box 
                      w={3} 
                      h={6} 
                      bg="teal.400" 
                      borderRadius="full" 
                      mr={3}
                    />
                    <Heading size="md" color={textColor}>{produit.name}</Heading>
                  </Flex>
                </CardHeader>
                <CardBody pt={2}>
                  <Text color={textColor} fontWeight="bold">
                    Prix : {produit.price}€
                  </Text>
                  {produit.description && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      {produit.description}
                    </Text>
                  )}
                  {produit.created_at && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Créé le : {new Date(produit.created_at).toLocaleDateString()}
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

export default Produits
