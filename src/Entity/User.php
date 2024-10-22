<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Username is required.")]
    #[Assert\Length(
        min: 3,
        max: 180,
        minMessage: "Username must be at least {{ limit }} characters long.",
        maxMessage: "Username cannot be longer than {{ limit }} characters."
    )]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Password is required.")]
    #[Assert\Length(
        min: 6,
        max: 255,
        minMessage: "Password must be at least {{ limit }} characters long.",
        maxMessage: "Password cannot be longer than {{ limit }} characters."
    )]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Email is required.")]
    #[Assert\Email(message: "The email '{{ value }}' is not a valid email.")]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: 'json')]
    private array $followed_vehicles = [];

    #[ORM\Column(type: 'datetime')]
    private \DateTime $created_at;
    
    public function __construct()
    {
        $this->created_at = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getFollowedVehicles(): array
    {
        return $this->followed_vehicles;
    }

    public function setFollowedVehicles(array $followed_vehicles): static
    {
        $this->followed_vehicles = $followed_vehicles;

        return $this;
    }

    // Implementing UserInterface methods

    public function getUserIdentifier(): string
    {
        return $this->username; // Unique identifier for the user
    }

    public function getRoles(): array
    {
        // Convert followed_vehicles from JSON to an array if it's a JSON string
        

        // Flatten the array to get the vehicle role names
        /*$roles = [];
        if (is_array($this->followed_vehicles)) {
            foreach ($this->followed_vehicles as $type => $ids) {
                foreach ($ids as $id) {
                    // For example, you can create roles based on vehicle types
                    $roles[] = 'ROLE_' . strtoupper($type) . '_' . $id; // e.g., ROLE_CAR_1, ROLE_CAR_2
                }
            }
        }

        // Merge with default roles and return unique roles
        return array_unique(array_merge($roles, ['ROLE_USER']));*/
        $roles = [];

        // Check if the type is set and create a role based on it
        if ($this->type) {
            // Create a role based on the user type (e.g., 'ROLE_MERCHANT')
            $roles[] = 'ROLE_' . strtoupper($this->type); // e.g., ROLE_MERCHANT
        }

        // Merge with default roles and return unique roles
        return array_unique(array_merge($roles, ['ROLE_USER']));
    }

    public function getSalt(): ?string
    {
        return null; // Not required if using bcrypt
    }

    public function eraseCredentials(): void
    {
        // Clear any temporary sensitive data if necessary
    }
}