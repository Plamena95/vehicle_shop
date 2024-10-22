<?php

namespace App\Entity;

use App\Repository\CartypeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CartypeRepository::class)]
class Car_type
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $type_name = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->type_name;
    }

    public function setName(string $name): static
    {
        $this->type_name = $name;

        return $this;
    }
}
