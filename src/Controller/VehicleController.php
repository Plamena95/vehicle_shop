<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\CartypeRepository;
use App\Repository\UserRepository;
use App\Repository\VehicleRepository;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Car;
use App\Entity\User;
use App\Entity\Motorcycle;
use App\Entity\Truck;
use App\Entity\Trailer;

class VehicleController extends AbstractController
{
    private $entityManager;
    private $types = array('car' => 'App\Entity\Car','motorcycle' => 'App\Entity\Motorcycle','trailer' => 'App\Entity\Trailer','truck' => 'App\Entity\Truck');

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/follow/{type}/{id}', name: 'follow_vehicle', methods: ['GET'])]

    public function follow($type,$id): Response
    {
        $user = $this->getUser();
        if ($user) {
            $followed_ids = $user->getFollowedVehicles();
            if (!isset($followed_ids[$type]) || !is_array($followed_ids[$type])) {
                $followed_ids[$type] = []; // Initialize it as an empty array
            }
            if(in_array($id,$followed_ids[$type])){
                $key = array_search($id, $followed_ids[$type]);
                if ($key !== false) {
                    unset($followed_ids[$type][$key]);
                }
                $action = false;
            }else{
                array_push($followed_ids[$type], $id);
                $action = true;
            }
            $user->setFollowedVehicles($followed_ids);
            $this->entityManager->flush();
            return new JsonResponse(['message' => $action ]);
        }
        return new JsonResponse(['message' => 'You are not logged in.']);
    }

    #[Route('/car/type', name: 'select_by_type')]
    public function getCarTypes(CartypeRepository $carTypeRepository): Response
    {
        $categories = $carTypeRepository->findAllCarTypes();
        $categoryData = [];

        foreach ($categories as $category) {
            $categoryData[] = [
                'id' => $category->getId(),
                'type_name' => $category->getName(),
            ];
        }

        return new JsonResponse($categoryData);
    }

    #[Route('/select_by_type/{name}', name: 'app_car_type')]
    public function getTabById(VehicleRepository $vehicleRepository, CartypeRepository $carTypeRepository, $name): JsonResponse
    {
        $type_repository = $this->types[strtolower($name)];
        $repository = $this->entityManager->getRepository($type_repository);
        $vehicles = $repository->findAll(); 

        $vehiclesData = [];
        $data = [];

        foreach ($vehicles as $key=>$vehicle) {
            $vehiclesData = [
                'id' => $vehicle->getId(),
                'brand' => $vehicle->getBrand(),
                'model' => $vehicle->getModel(),
                'price' => $vehicle->getPrice(),
            ];
            if ($name == 'Car') {
                $specificFields = [
                    'Engine Capacity' => $vehicle->getEngineCapacity(),
                    'Doors' => $vehicle->getDoors(),
                    'Category' => $vehicle->getCategory(),
                    'Color' => ucwords($vehicle->getColor()),
                ];
                $category = $carTypeRepository->find($specificFields['Category']);
                $cat_name = $category->getName();
                $specificFields['Category'] = $cat_name;
            } elseif ($name == 'Motorcycle') {
                $specificFields = [
                    'Engine Capacity' => $vehicle->getEngineCapacity(),
                    'Color' => $vehicle->getColor(),
                ];
            } elseif ($name == 'Truck') {
                $specificFields = [
                    'Engine Capacity' => $vehicle->getEngineCapacity(),
                    'Beds' => $vehicle->getBeds(),
                    'Color' => ucwords($vehicle->getColor()),
                ];
            } elseif ($name == 'Trailer') {
                $specificFields = [
                    'Load Capacity' => $vehicle->getLoadCapacity(),
                    'Axles' => $vehicle->getAxles(),
                ];
            }
            $data[$key] = array_merge($vehiclesData, $specificFields);
        }

        $data[0]['type'] = $name;

        return new JsonResponse($data);
    }

    #[Route('/followed', name: 'followed')]
    public function getFollowed(VehicleRepository $vehicleRepository, CartypeRepository $carTypeRepository, Request $request): JsonResponse
    {
        $request = $request->getContent();
        $request = json_decode($request);
        $vehicles = [];
        foreach ($request->followed as $key => $ids) {
            $type_repository = $this->types[$key];
            $repository = $this->entityManager->getRepository($type_repository);
        
            foreach ($ids as $id) {
                $vehicle = $repository->find($id);
                $vehiclesData = [
                    'id' => $vehicle->getId(),
                    'brand' => $vehicle->getBrand(),
                    'model' => $vehicle->getModel(),
                    'price' => $vehicle->getPrice(),
                    'type' => $key
                ];
                $specificFields = [];
        
                if ($key == 'car') {
                    $specificFields = [
                        'Engine Capacity' => $vehicle->getEngineCapacity(),
                        'Doors' => $vehicle->getDoors(),
                        'Category' => $vehicle->getCategory(),
                    ];
                    $category = $carTypeRepository->find($specificFields['Category']);
                    $cat_name = $category->getName();
                    $specificFields['Category'] = $cat_name;
                } elseif ($key == 'motorcycle') {
                    $specificFields = [
                        'Engine Capacity' => $vehicle->getEngineCapacity(),
                    ];
                } elseif ($key == 'truck') {
                    $specificFields = [
                        'Engine Capacity' => $vehicle->getEngineCapacity(),
                        'Beds' => $vehicle->getBeds(),
                        'Color' => ucwords($vehicle->getColor()),
                    ];
                } elseif ($key == 'trail') {
                    $specificFields = [
                        'Load Capacity' => $vehicle->getLoadCapacity(), 
                        'Axles' => $vehicle->getAxles(),
                    ];
                }
        
                $data = array_merge($vehiclesData, $specificFields);
                $vehicles[] = $data; 
            }
        }

        return new JsonResponse($vehicles);
    }

    #[Route('/vehicle/{type}/{id}', name: 'single_vehicle') ]

    public function getVehicle(VehicleRepository $vehicleRepository,CartypeRepository $carTypeRepository, $type, $id): JsonResponse
    {
        $type_repository = $this->types[$type];

        if (!array_key_exists($type, $this->types)) {
            return $this->redirectToRoute('app_default');
        }

        $repository = $this->entityManager->getRepository($type_repository);

        $user = $this->getUser(); 
        $isFollowing = false;
        if ($user) {
            $followed_ids = $user->getFollowedVehicles();
            if(isset($followed_ids[$type]) && is_array($followed_ids[$type])){
                $isFollowing = in_array($id, $followed_ids[$type]);
            }
        }
        $uploadsDirectory = $this->getParameter('uploads_directory');
        $count = count(glob($uploadsDirectory .'/' . $type . '/' . $id.'/*.jpg'));
        $vehicle = $repository->find($id);
        $commonFields = [
            'brand' => $vehicle->getBrand(),
            'model' => $vehicle->getModel(),
            'price' => $vehicle->getPrice(),
            'quantity' => $vehicle->getQuantity(),
            'type' => $type,
            'id' => $id,
            'isFollowing' => $isFollowing,
            'image_count' => $count
        ];
        $specificFields = [];
        
        if ($type == 'car') {
            $specificFields = [
                'Engine Capacity' => $vehicle->getEngineCapacity(),
                'Doors' => $vehicle->getDoors(),
                'Category' => $vehicle->getCategory(),
                'Color' => ucwords($vehicle->getColor()),
            ];
            $category = $carTypeRepository->find($specificFields['Category']);
            $cat_name = $category->getName();
            $specificFields['Category'] = $cat_name;
        } elseif ($type == 'motorcycle') {
            $specificFields = [
                'Engine Capacity' => $vehicle->getEngineCapacity(),
                'Color' => $vehicle->getColor(),
            ];
        } elseif ($type == 'truck') {
            $specificFields = [
                'Engine Capacity' => $vehicle->getEngineCapacity(),
                'Beds' => $vehicle->getBeds(),
                'Color' => ucwords($vehicle->getColor()),
            ];
        } elseif ($type == 'trail') {
            $specificFields = [
                'Load Capacity' => $vehicle->getEngineCapacity(),
                'Axles' => $vehicle->getAxles(),
            ];
        }

        $commonFields['more_vehicles'] = [];
        $more_vehicles = $repository->createQueryBuilder('v') 
                        ->setMaxResults(6) 
                        ->getQuery() 
                        ->getResult(); 

        foreach ($more_vehicles as $vehicle) {
            $vehicles = [
                'id' => $vehicle->getId(),
                'brand' => $vehicle->getBrand(),
                'model' => $vehicle->getModel(),
                'price' => $vehicle->getPrice(),
            ];
            
            if ($type == 'car') {
                $more_data = [
                    'Engine Capacity' => $vehicle->getEngineCapacity(),
                    'Doors' => $vehicle->getDoors(),
                    'Category' => $vehicle->getCategory(),
                    'Color' => ucwords($vehicle->getColor()),
                ];
                $category = $carTypeRepository->find($more_data['Category']);
                $cat_name = $category->getName();
                $more_data['Category'] = $cat_name;
            } elseif ($type == 'motorcycle') {
                $more_data = [
                    'Engine Capacity' => $vehicle->getEngineCapacity(),
                    'Color' => $vehicle->getColor(),
                ];
            } elseif ($type == 'truck') {
                $more_data = [
                    'Engine Capacity' => $vehicle->getEngineCapacity(),
                    'Beds' => $vehicle->getBeds(),
                    'Color' => ucwords($vehicle->getColor()),
                ];
            } elseif ($type == 'trail') {
                $more_data = [
                    'Load Capacity' => $vehicle->getEngineCapacity(),
                    'Axles' => $vehicle->getAxles(),
                ];
            }

            $commonFields['more_vehicles'][] = array_merge($vehicles,$more_data);
        }

        $vehicleData[] = array_merge($commonFields, $specificFields);

        return new JsonResponse($vehicleData);
    }

    #[Route('/make-product', name: 'product', methods: ['POST'])]
    public function makeProduct(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $vehicle_repository = $this->types[$data['type']];

        
        if (!class_exists($vehicle_repository)) {
            return new Response('Invalid entity class provided.', 400);
        }
        
        $repository = $this->entityManager->getRepository($vehicle_repository);

        
        $entity = new $this->types[$data['type']]();
        $data['quantity'] = 1;
        
        foreach ($data as $property => $value) {
            if($property != 'type'){
                if($property == 'engine_capacity'){
                    $property = 'EngineCapacity';
                }else if($property == 'load_capacity'){
                    $property = 'LoadCapacity';
                }
                $setter = 'set' . ucfirst($property); 

                if (method_exists($entity, $setter)) {
                    $entity->$setter($value);
                } else {
                    return new Response('Invalid property: ' . $property, 400);
                }
            }
        }

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $entity->getId(),
            'type' => $data['type'], 
        ]);
    }

    #[Route('/upload-image', name: 'upload_image')]
    public function uploadImage(Request $request)
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $name = $request->request->get('id');
        $type = $request->request->get('type');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        $uploadsDirectory = $this->getParameter('uploads_directory');
        $fullDirectory = $uploadsDirectory . '/' . $type . '/' . $name;
        if (!is_dir($fullDirectory)) {
            mkdir($fullDirectory, 0755, true);
        }
        $count = count(glob($uploadsDirectory .'/' . $type . '/' . $name.'/*.jpg'));
        if($count > 0){
            $name = $name.'-'.$count+1;
        }
        $newFilename = $name.'.jpg';
        try {
            $file->move(
                $fullDirectory,
                $newFilename
            );
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Could not upload the image'], 500);
        }

        return new JsonResponse(['message' => 'Image uploaded successfully', 'filename' => $newFilename]);
    }
}
