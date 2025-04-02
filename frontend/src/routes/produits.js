import { useEffect, useState } from "react";
import { 
  VStack, Box, Heading, Spinner, Badge, 
  Card, CardBody, Text, Button, Image, 
  Flex, IconButton, useToast, Grid, 
  useDisclosure, Drawer, DrawerOverlay,
  DrawerContent, DrawerHeader, DrawerBody,
  DrawerFooter, Divider, Stack
} from "@chakra-ui/react";
import { FaShoppingCart, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { get_produits } from "../api/endpoints";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"
import { FiLogOut, FiBookOpen } from "react-icons/fi"

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [panier, setPanier] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logoutUser } = useAuth()

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const data = await get_produits();
        setProduits(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduits();
  }, []);
  const handleLogout = async () => {
    await logoutUser()
  }
  const ajouterAuPanier = (produit) => {
    setPanier(prev => {
      const existeDeja = prev.find(item => item.id === produit.id);
      if (existeDeja) {
        return prev.map(item =>
          item.id === produit.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...produit, quantity: 1 }];
    });
    toast({
      title: "Produit ajouté",
      description: `${produit.name} a été ajouté à votre panier`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const retirerDuPanier = (produitId) => {
    setPanier(prev => prev.filter(item => item.id !== produitId));
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de votre panier",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const modifierQuantite = (produitId, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) {
      retirerDuPanier(produitId);
      return;
    }
    setPanier(prev =>
      prev.map(item =>
        item.id === produitId ? { ...item, quantity: nouvelleQuantite } : item
      )
    );
  };

  const totalPanier = panier.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Box minHeight="100vh" p={{ base: 4, md: 8 }} bg="gray.50">
      <Flex justify="space-between" align="center" mb={8}>
      <IconButton
            icon={<FiLogOut />}
            aria-label="Logout"
            onClick={handleLogout}
            colorScheme="red"
            variant="outline"
            size="lg"
          />
        <Heading as="h1" size="xl" color="teal.600">Nos Produits</Heading>
        <Button 
          leftIcon={<FaShoppingCart />} 
          colorScheme="teal"
          variant="solid"
          onClick={onOpen}
          position="relative"
          isDisabled={panier.length === 0}
        >
          Panier
          {panier.length > 0 && (
            <Badge 
              ml={2} 
              colorScheme="orange" 
              borderRadius="full" 
              px={2}
            >
              {panier.reduce((total, item) => total + item.quantity, 0)}
            </Badge>
          )}
        </Button>
     
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Flex>
      ) : (
        <Grid 
          templateColumns={{ 
            base: "1fr", 
            md: "repeat(2, 1fr)", 
            lg: "repeat(3, 1fr)" 
          }} 
          gap={6}
        >
          {produits.map((produit) => (
            <Card 
              key={produit.id} 
              boxShadow="lg" 
              borderRadius="xl" 
              overflow="hidden"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-5px)" }}
            >
              {produit.url && (
                <Image
                  src={produit.url}
                  alt={produit.name}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
              )}
              <CardBody>
                <Heading size="md" mb={2}>{produit.name}</Heading>
                <Text color="gray.600" mb={4}>{produit.description}</Text>
                <Flex justify="space-between" align="center">
                  <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
                    {produit.price}€
                  </Badge>
                  {panier.some(item => item.id === produit.id) ? (
                    <Flex align="center">
                      <IconButton
                        icon={<FaMinus />}
                        onClick={() => modifierQuantite(produit.id, panier.find(item => item.id === produit.id).quantity - 1)}
                        size="sm"
                        colorScheme="teal"
                        aria-label="Réduire quantité"
                        mr={2}
                      />
                      <Text mx={2} fontWeight="bold">
                        {panier.find(item => item.id === produit.id).quantity}
                      </Text>
                      <IconButton
                        icon={<FaPlus />}
                        onClick={() => modifierQuantite(produit.id, panier.find(item => item.id === produit.id).quantity + 1)}
                        size="sm"
                        colorScheme="teal"
                        aria-label="Augmenter quantité"
                      />
                    </Flex>
                  ) : (
                    <Button 
                      colorScheme="teal" 
                      leftIcon={<FaPlus />}
                      onClick={() => ajouterAuPanier(produit)}
                      size="sm"
                    >
                      Ajouter
                    </Button>
                  )}
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}

      {/* Panier Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center">
              <FaShoppingCart style={{ marginRight: "10px" }} />
              Votre Panier
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            {panier.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={10}>
                Votre panier est vide
              </Text>
            ) : (
              <Stack spacing={4}>
                {panier.map((item) => (
                  <Box key={item.id} py={3} borderBottomWidth="1px">
                    <Flex justify="space-between">
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text>{item.price}€ x {item.quantity}</Text>
                    </Flex>
                    <Flex justify="space-between" mt={2} align="center">
                      <Flex align="center">
                        <IconButton
                          icon={<FaMinus />}
                          size="xs"
                          onClick={() => modifierQuantite(item.id, item.quantity - 1)}
                          aria-label="Réduire quantité"
                        />
                        <Text mx={2}>{item.quantity}</Text>
                        <IconButton
                          icon={<FaPlus />}
                          size="xs"
                          onClick={() => modifierQuantite(item.id, item.quantity + 1)}
                          aria-label="Augmenter quantité"
                        />
                      </Flex>
                      <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => retirerDuPanier(item.id)}
                        aria-label="Supprimer"
                      />
                    </Flex>
                  </Box>
                ))}
              </Stack>
            )}
          </DrawerBody>
          {panier.length > 0 && (
            <>
              <Divider />
              <DrawerFooter>
                <Flex justify="space-between" w="full">
                  <Text fontWeight="bold">Total:</Text>
                  <Text fontWeight="bold">{totalPanier.toFixed(2)}€</Text>
                </Flex>
                <Button 
                  colorScheme="teal" 
                  mt={4} 
                  w="full"
                  onClick={() => {
                    onClose();
                    navigate("/commande");
                  }}
                >
                  Passer la commande
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Produits;