<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/')]
class WebController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/products', name: 'products')]
    public function products(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/profile', name: 'profile')]
    public function profile(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/{type}/{id}', name: 'vehicle')]
    public function vehicle(string $type, int $id): Response
    {
        return $this->render('home/index.html.twig', 
        [
            'type' => $type,
            'id' => $id,
        ]);
    }

    #[Route('/{any}', name: 'app_default', requirements: ['any' => '.*'])]
    public function notFound(): Response
    {
        return $this->render('error/404.html.twig', [], new Response('', Response::HTTP_NOT_FOUND));
    }
    
}
