#!/usr/bin/perl

use strict;

my $name = shift @ARGV || die "\nLack of commit name\n\n";

foreach my $arg ( @ARGV ) {
  $name .= " $arg";
}

my @files = qw("commit.pl"
	       "LICENSE.txt"
	       "README.md"
	       "package.json"
	       "server.js"
	       "lib/*.js"
	     );

# "views/*.handlebars"
# "views/layouts/*.handlebars"
# "public/*"

foreach my $file ( @files ) {
  system("git add $file");
}


system("git commit -m '$name'\n");
