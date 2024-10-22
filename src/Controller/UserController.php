<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;

class UserController extends AbstractController
{

    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $entityManager;
    private TokenStorageInterface $tokenStorage;
    private $types = array('car' => 'App\Entity\Car','motorcycle' => 'App\Entity\Motorcycle','trailer' => 'App\Entity\Trailer','truck' => 'App\Entity\Truck');

    public function __construct(TokenStorageInterface $tokenStorage,
     UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, CsrfTokenManagerInterface $csrfTokenManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
        $this->csrfTokenManager = $csrfTokenManager;
        $this->tokenStorage = $tokenStorage;
    }

    #[Route('/csrf-token', name: 'csrf_token')]
    public function getCsrfToken(): JsonResponse
    {
        $token = $this->csrfTokenManager->getToken('authenticate')->getValue();
        return new JsonResponse(['csrf_token' => $token]);
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): Response
    // ValidatorInterface $validator - validate User data as it's set in User Entity
    {
        $data = json_decode($request->getContent(), true);
        
        $user = new User();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setType($data['type']);
        $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($user);
        $entityManager->flush(); // insert the user in the DB

        return $this->json(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }

    #[Route('/reset-password', name: 'reser-password', methods: ['POST'])]
    public function reset(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if (!$user){
            return $this->json(['message' => 'Invalid email!']);
        }

        $user->setPassword(password_hash($data['new-password'], PASSWORD_BCRYPT));
        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            return $this->json(['message' => (string) $errors]);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Your password has been reset successfully!']);
    }

    #[Route('/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): JsonResponse
    {
        $error = $authenticationUtils->getLastAuthenticationError();

        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->json([
            'last_username' => $lastUsername,
            'error' => $error ? $error->getMessage() : null,
        ]);
    }

    #[Route('/signin', name: 'app_signin', methods: ['POST'])]
    public function signin(Request $request): JsonResponse
    {
        $csrfToken = $request->request->get('_csrf_token');

        // Validate CSRF token
        if (!$this->csrfTokenManager->isTokenValid(new CsrfToken('authenticate', $csrfToken))) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 400);
        }

        $username = $request->request->get('username');
        $password = $request->request->get('password');

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password) ) {
            return $this->json(['message' => 'Invalid credentials!']);
        }

        $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
        $this->tokenStorage->setToken($token);
        $request->getSession()->set('_security_main', serialize($token)); // set the session

        $session = $request->getSession()->get('_security_main');
        $data = [];
        $data['followed']  = $user->getFollowedVehicles();
        $data['type']  = $user->getType();
        return $this->json(['message' => 'Login successful', 'user' => $data]);
    }

    #[Route('/check-user', name: 'api_status')]
    public function status(): Response
    {
        $user = $this->getUser();

        if(null === $user)
        {
            return $this->json([
                'loggedIn' => false
            ]);
        }
        else
        {
            return $this->json([
                'loggedIn' => true,
                'username' => $user->getUserIdentifier(),
                'followed' => $user->getFollowedVehicles(),
                'type' => $user->getType(),
                'id' => $user->getId(),
            ]);
        }
    }

}
