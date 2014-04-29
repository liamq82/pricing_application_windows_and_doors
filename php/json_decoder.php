<?php
$products_json = $_POST['json'];
/*$products_json = '[{"type":"window","location":"kitchen","width":"350","height":"555","design":"design_a","color":"White","id":17},{"type":"window","location":"living room","width":"590","height":"300","design":"design_f","color":"White","id":67},{"type":"window","location":"bedroom","width":"555","height":"1000","design":"design_b","color":"White","id":96},{"type":"window","location":"bathroom","width":"590","height":"990","design":"design_c","color":"White","id":22}]';*/
$json_decoded = json_decode($products_json, true);
$windows = [];

class Window
	{
	    // property declaration
	    public $type='';
	    public $location='';
	    public $width=0;
	    public $height=0;
	    public $design='';
	    public $color='';
	    public $id=0;

		function __construct($type, $location, $width, $height, $design, $color, $id) {
			$this->type = $type;
			$this->location = $location;
			$this->width = $width;
			$this->height = $height;
			$this->design = $design;
			$this->color = strtolower($color);
			$this->id = $id;
		}

	    // method declaration
	    public function displayData() {
	        echo 'type= ' . $this->type . ',' . ' location= ' . $this->location . ',' . ' width= ' . $this->width . ',' . ' height= ' . $this->height . ',' . ' design= ' . $this->design . ',' . ' color= ' . $this->color . ',' . ' id= ' . $this->id;
	    }
	}

	class QuotationBuilder
	{

		public $quote = 0;

		public function price($window) {
			$width = $window->width;
			$height = $window->height;
			$design = $window->design;
			$color = strtolower($window->color);
			$design_factor = 0;
			$color_factor = 0;

			switch ($design) {
			    case 'design_a':
			        $design_factor = 2;
			        break;
			    case 'design_b':
			        $design_factor = 2.5;
			        break;
			    case 'design_c':
			        $design_factor = 3;
			        break;
			    case 'design_d':
			        $design_factor = 2;
			        break;
			    case 'design_e':
			        $design_factor = 2.5;
			        break;
			    case 'design_f':
			        $design_factor = 3;
			        break;
			}
			switch ($color) {
			    case 'white':
			        $color_factor = 1;
			        break;
			    case 'cream':
			        $color_factor = 1.5;
			        break;
			    case 'black':
			        $color_factor = 2;
			        break;
			    case 'woodgrain':
			        $color_factor = 2;
			        break;
			}
			$this->quote = ($width + $height) * ($design_factor) * ($color_factor);
	    }

		public function getQuote() {
			return $this->quote;
		}

	}

for ($index = 0; $index < count($json_decoded); $index++) {
	$window_data = $json_decoded[$index];
	$type = $window_data['type'];
	$location = $window_data['location'];
	$width = $window_data['width'];
	$height = $window_data['height'];
	$design = $window_data['design'];
	$color = $window_data['color'];
	$id = $window_data['id'];
	$window = new Window($type, $location,	$width, $height, $design, $color, $id);
    $windows[$index] = $window;
}

$quotes = [];
$quote_builder = new QuotationBuilder();

for ($index = 0; $index < count($windows); $index++) {
	$quote_builder->price($windows[$index]);
	$quote = $quote_builder->getQuote();
	$quotes[$index] = $quote;
}

$total = 0;
foreach ($quotes as &$price) {
    $total = $total + $price;
}

echo 'The total cost for your ' . count($windows) . ' windows is €' . $total;


?>