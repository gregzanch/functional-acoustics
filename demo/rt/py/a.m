A = csvread('data.txt');
length(A);


figure
h1 = axes
[x,y] = meshgrid(1:size(A)(2),1:size(A)(1));
surf(x,y,A)
colormap(jet)
set(h1, 'Ydir', 'reverse')
set(h1, 'YAxisLocation', 'Right')

pause;